"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { SiGithub, SiGoogle, SiLinkedin, SiDiscord } from "react-icons/si";
import { useRouter } from "next/navigation";

// Define form validation schema (without confirm password)
const FormSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must have at least 8 characters"),
});

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
    
    const router = useRouter();

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password,
      }),
    });
      
      if (response.ok) {
          router.push('/');
      } 
      else {
          console.error('Registration failed!');
      }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an Account!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                {/* Username Field */}
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" type="text" {...register("username")} />
                  {errors.username && (
                    <p className="text-red-500 text-sm">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </div>
            </form>

            {/* OAuth Sign-In Options */}
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or sign up with
              </span>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                <SiGoogle />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signIn("linkedin", { callbackUrl: "/" })}
              >
                <SiLinkedin />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signIn("discord", { callbackUrl: "/" })}
              >
                <SiDiscord />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signIn("github", { callbackUrl: "/" })}
              >
                <SiGithub />
              </Button>
            </div>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Privacy Policy */}
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
