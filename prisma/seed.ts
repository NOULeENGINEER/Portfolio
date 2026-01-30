import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create resume
  const resume = await prisma.resume.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Noussayr Derbel',
      headline: 'Full-Stack Developer & Cloud Architect',
      location: 'Tunis, Tunisia',
      summary: 'Experienced software engineer with 5+ years building scalable web applications and cloud infrastructure. Passionate about clean code, DevOps practices, and modern web technologies.',
      email: 'noussayr.derbel@example.com',
      phone: '+216 XX XXX XXX',
      website: 'https://noussayr.derbel.dev',
      linkedin: 'https://linkedin.com/in/noussayr-derbel',
      github: 'https://github.com/noussayr',
      twitter: 'https://twitter.com/noussayr',
      skills: JSON.stringify([
        { category: 'Programming', items: ['TypeScript', 'Python', 'Go', 'Java'] },
        { category: 'Frontend', items: ['React', 'Next.js', 'TailwindCSS', 'Vue.js'] },
        { category: 'Backend', items: ['Node.js', 'Express', 'FastAPI', 'Spring Boot'] },
        { category: 'Cloud & DevOps', items: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform'] },
        { category: 'Databases', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma'] },
        { category: 'Security', items: ['OAuth2', 'JWT', 'OWASP', 'Penetration Testing'] },
      ]),
      languages: JSON.stringify([
        { name: 'Arabic', proficiency: 'Native' },
        { name: 'French', proficiency: 'Native' },
        { name: 'English', proficiency: 'Professional' },
      ]),
      experience: JSON.stringify([
        {
          role: 'Senior Full-Stack Developer',
          company: 'TechCorp Solutions',
          startDate: 'Jun 2021',
          endDate: null,
          description: 'Leading development of microservices architecture serving 100K+ users. Built CI/CD pipelines reducing deployment time by 60%.',
          achievements: [
            'Architected and deployed scalable infrastructure on AWS',
            'Reduced API response time by 40% through optimization',
            'Mentored team of 3 junior developers',
          ]
        },
        {
          role: 'Full-Stack Developer',
          company: 'StartupXYZ',
          startDate: 'Mar 2019',
          endDate: 'May 2021',
          description: 'Developed customer-facing web applications using React and Node.js. Implemented real-time features and payment integrations.',
          achievements: [
            'Built MVP in 3 months leading to Series A funding',
            'Integrated Stripe payments processing $1M+ annually',
            'Implemented real-time chat with WebSocket',
          ]
        },
      ]),
      education: JSON.stringify([
        {
          degree: 'Master of Science in Computer Science',
          institution: 'University of Tunis',
          startDate: '2016',
          endDate: '2018',
          description: 'Focus on distributed systems and cloud computing',
        },
        {
          degree: 'Bachelor of Science in Software Engineering',
          institution: 'ESPRIT',
          startDate: '2013',
          endDate: '2016',
        },
      ]),
      certifications: JSON.stringify([
        {
          name: 'AWS Certified Solutions Architect - Professional',
          issuer: 'Amazon Web Services',
          date: 'Oct 2022',
          url: 'https://aws.amazon.com/certification/',
        },
        {
          name: 'Certified Kubernetes Administrator (CKA)',
          issuer: 'Cloud Native Computing Foundation',
          date: 'Mar 2021',
        },
      ]),
    },
  })
  console.log('✅ Created resume data')

  // Create sample projects
  const projects = [
    {
      slug: 'ecommerce-platform',
      title: 'E-Commerce Platform with Microservices',
      shortSummary: 'Scalable e-commerce solution built with microservices architecture',
      longDescription: `## Overview
A comprehensive e-commerce platform built with microservices architecture, handling thousands of transactions daily.

## Problem Statement
Existing monolithic system couldn't scale during peak shopping seasons, leading to downtime and lost revenue.

## Solution
Designed and implemented a microservices-based architecture with:
- Order processing service
- Inventory management
- Payment gateway integration
- Real-time notifications

## Tech Stack
- Backend: Node.js, Express, gRPC
- Frontend: Next.js, TypeScript
- Database: PostgreSQL, Redis
- Infrastructure: Kubernetes, Docker, AWS

## Impact
- 99.9% uptime during Black Friday
- 3x improvement in response time
- Reduced infrastructure costs by 30%`,
      status: 'Published',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2023-06-01'),
      role: 'Lead Backend Developer',
      organization: 'TechCorp Solutions',
      techTags: JSON.stringify(['Node.js', 'Next.js', 'PostgreSQL', 'Kubernetes', 'AWS']),
      skillTags: JSON.stringify(['Microservices', 'System Design', 'DevOps']),
      githubUrl: 'https://github.com/example/ecommerce',
      demoUrl: 'https://demo.example.com',
      featured: true,
      visibility: 'public',
    },
    {
      slug: 'ai-chatbot-platform',
      title: 'AI-Powered Customer Support Chatbot',
      shortSummary: 'Intelligent chatbot reducing support tickets by 60%',
      longDescription: `## Overview
An AI-powered chatbot platform that handles customer inquiries using natural language processing.

## Challenge
Customer support team was overwhelmed with repetitive questions, leading to slow response times.

## Solution
Built an intelligent chatbot that:
- Understands natural language queries
- Integrates with knowledge base
- Escalates to human agents when needed
- Learns from interactions

## Technology
- Python, FastAPI
- OpenAI GPT-4 API
- React frontend
- PostgreSQL + Vector database

## Results
- 60% reduction in support tickets
- Average response time under 2 seconds
- 90% customer satisfaction rate`,
      status: 'Published',
      startDate: new Date('2023-03-01'),
      endDate: new Date('2023-09-01'),
      role: 'Full-Stack Developer',
      organization: 'TechCorp Solutions',
      techTags: JSON.stringify(['Python', 'FastAPI', 'React', 'OpenAI', 'PostgreSQL']),
      skillTags: JSON.stringify(['AI/ML', 'NLP', 'API Design']),
      githubUrl: 'https://github.com/example/chatbot',
      blogUrl: 'https://blog.example.com/ai-chatbot',
      featured: true,
      visibility: 'public',
    },
    {
      slug: 'real-time-analytics-dashboard',
      title: 'Real-Time Analytics Dashboard',
      shortSummary: 'Live data visualization for business intelligence',
      longDescription: `## Overview
A real-time analytics dashboard providing actionable insights from millions of data points.

## Requirements
- Process 10K+ events per second
- Sub-second latency for visualizations
- Support multiple data sources
- Role-based access control

## Implementation
- Event streaming with Apache Kafka
- Data processing with Apache Spark
- Visualization with D3.js and Recharts
- WebSocket for real-time updates

## Technologies
- Backend: Scala, Akka
- Frontend: React, TypeScript, D3.js
- Data: Kafka, Spark, TimescaleDB
- Infrastructure: Docker, Kubernetes

## Achievements
- Processing 500K+ events/second
- 300ms average query response time
- Used by 50+ teams across organization`,
      status: 'Published',
      startDate: new Date('2021-06-01'),
      endDate: new Date('2022-12-01'),
      role: 'Senior Developer',
      organization: 'TechCorp Solutions',
      techTags: JSON.stringify(['Scala', 'React', 'Kafka', 'Spark', 'Kubernetes']),
      skillTags: JSON.stringify(['Big Data', 'Real-Time Systems', 'Data Visualization']),
      demoUrl: 'https://analytics.example.com',
      featured: true,
      visibility: 'public',
    },
    {
      slug: 'mobile-banking-app',
      title: 'Mobile Banking Application',
      shortSummary: 'Secure mobile banking app with biometric authentication',
      longDescription: `## Overview
A secure mobile banking application serving 50K+ users with advanced security features.

## Security Features
- Biometric authentication (Face ID, Touch ID)
- End-to-end encryption
- Fraud detection with ML
- Multi-factor authentication
- Secure key storage

## Features
- Account management
- Fund transfers
- Bill payments
- Investment portfolio tracking
- Real-time notifications

## Stack
- React Native
- Node.js backend
- PostgreSQL
- AWS infrastructure
- Redis caching

## Impact
- 50K+ active users
- 4.8/5 app store rating
- Zero security breaches
- 99.95% uptime`,
      status: 'Published',
      startDate: new Date('2020-01-01'),
      endDate: new Date('2021-05-01'),
      role: 'Mobile Developer',
      organization: 'StartupXYZ',
      techTags: JSON.stringify(['React Native', 'Node.js', 'PostgreSQL', 'AWS']),
      skillTags: JSON.stringify(['Mobile Development', 'Security', 'FinTech']),
      visibility: 'public',
    },
    {
      slug: 'internal-tool-project',
      title: 'Internal DevOps Automation Tool',
      shortSummary: 'Private internal tool for deployment automation',
      longDescription: `## Overview
Confidential internal tool for automating deployment processes.

## Features
- Automated deployments
- Infrastructure provisioning
- Monitoring integration
- Rollback capabilities

## Tech
- Go, Terraform, Kubernetes

This project is under NDA and details cannot be shared publicly.`,
      status: 'Draft',
      startDate: new Date('2023-10-01'),
      role: 'DevOps Engineer',
      organization: 'Confidential',
      techTags: JSON.stringify(['Go', 'Terraform', 'Kubernetes']),
      skillTags: JSON.stringify(['DevOps', 'Automation']),
      visibility: 'private',
    },
  ]

  for (const projectData of projects) {
    const project = await prisma.project.upsert({
      where: { slug: projectData.slug },
      update: {},
      create: projectData,
    })
    console.log('✅ Created project:', project.title)
  }

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
