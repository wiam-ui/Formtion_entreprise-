import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)
        try {
            await register(fullname, email, password)
            navigate("/dashboard")
        } catch (err: any) {
            setError(err.response?.data || "Failed to register. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <FieldGroup>
                            {/* Title */}
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Create an account</h1>
                                <p className="text-balance text-muted-foreground">
                                    Sign up to get started
                                </p>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm text-center font-medium">
                                    {error}
                                </div>
                            )}

                            {/* Full Name */}
                            <Field>
                                <FieldLabel htmlFor="fullname">Full Name</FieldLabel>
                                <Input
                                    id="fullname"
                                    type="text"
                                    placeholder="John Doe"
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                    required
                                />
                            </Field>

                            {/* Email */}
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Field>

                            {/* Password */}
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Field>

                            {/* Submit */}
                            <Field>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Creating account..." : "Register"}
                                </Button>
                            </Field>

                            {/* Switch to login */}
                            <FieldDescription className="text-center">
                                Already have an account?{" "}
                                <Link to="/login">Login</Link>
                            </FieldDescription>
                        </FieldGroup>
                    </form>

                    {/* Image side */}
                    <div className="relative hidden bg-muted md:block">
                        <img
                            src="/form-image.jpg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Terms */}
            <FieldDescription className="px-6 text-center">
                By creating an account, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}