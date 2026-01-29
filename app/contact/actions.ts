"use server"

import { prisma } from "@/lib/prisma"
import { contactSchema } from "@/lib/validations"
import { headers } from "next/headers"

// Simple in-memory rate limiter for development
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean up every minute

function checkRateLimit(ip: string): { allowed: boolean; resetAt?: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)

  if (!entry || entry.resetAt < now) {
    // Create new entry or reset expired one
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + 3600000, // 1 hour from now
    })
    return { allowed: true }
  }

  if (entry.count >= 3) {
    // Rate limit exceeded
    return { allowed: false, resetAt: entry.resetAt }
  }

  // Increment count
  entry.count++
  return { allowed: true }
}

async function getClientIp(): Promise<string> {
  const headersList = await headers()
  const forwarded = headersList.get("x-forwarded-for")
  const realIp = headersList.get("x-real-ip")
  
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  if (realIp) {
    return realIp
  }
  return "unknown"
}

export async function submitContactForm(formData: FormData) {
  try {
    // Get client IP
    const ipAddress = await getClientIp()

    // Check rate limit
    const rateLimit = checkRateLimit(ipAddress)
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetAt!)
      return {
        success: false,
        error: `Rate limit exceeded. Please try again after ${resetDate.toLocaleTimeString()}.`,
      }
    }

    // Parse and validate form data
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
      honeypot: formData.get("honeypot") as string,
    }

    // Check honeypot field - if filled, it's spam
    if (data.honeypot) {
      console.log("Spam detected: honeypot field filled")
      return {
        success: false,
        error: "Invalid submission detected.",
      }
    }

    // Validate with Zod schema
    const validatedData = contactSchema.parse(data)

    // Save to database
    await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject || null,
        message: validatedData.message,
        ipAddress,
        status: "unread",
      },
    })

    // Log to console (optional)
    console.log("New contact message received:", {
      from: validatedData.email,
      name: validatedData.name,
      subject: validatedData.subject,
    })

    return {
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    
    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Please check your form inputs and try again.",
      }
    }

    return {
      success: false,
      error: "An error occurred while submitting your message. Please try again later.",
    }
  }
}
