import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileQuestion, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-6">
              <FileQuestion className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground">
              The project you're looking for doesn't exist or is not publicly available.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button asChild variant="default">
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Projects
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
