"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email("Please Enter Valid Email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/login",
        values
      );

      const Token = response.data.Token;
      const data = response.data.data;

      localStorage.setItem("Sanctum_Token", Token);
      localStorage.setItem("User_Data", JSON.stringify(data));

      router.push("/Dashboard");
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message ||
        "Login failed. Check server status.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (error != null) {
    return (
      <Alert>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-3 items-center h-screen justify-center">
      <Card>
        <CardHeader className="items-center">
          <CardTitle>Login Page</CardTitle>
          <CardDescription>Login to your Account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-3 mb-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password:</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {loading ? "Navigating..." : "Login"}
              </Button>
            </form>
          </Form>
          <p>
            Don't have an account?{" "}
            <Link href="/SignUp" className="text-red-700 hover:text-blue-600">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
