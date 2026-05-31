import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 text-center">
          
          {/* 404 Code */}
          <div className="text-7xl font-bold tracking-tight text-primary">
            404
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              Not Found
            </h2>
            <p className="text-sm text-muted-foreground">
              The page you are looking for does not exist.
            </p>
          </div>

          {/* Primary Action */}
          <Button asChild className="w-full">
            <Link to="/login">
              Go to Login
            </Link>
          </Button>

          {/* Secondary Action */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>

        </div>
      </div>
  )
}