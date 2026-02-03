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

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json"
  },
  withCredentials: true
})

api.interceptors.request.use(
  (config) => {
    const token = getCookie('XSRF-TOKEN');
    if (token && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }  
);

async function getCsrfCookie() {
  await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
    withCredentials: true
  });
}

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
      
      // Get CSRF token first
      await getCsrfCookie();
      
      // Login request - interceptor will automatically add X-XSRF-TOKEN
      const response = await api.post("/login", values);
      console.log("Login successful:", response.data);
      
      router.push("/Dashboard");
    } catch (error: any) {
      console.log("Full error:", error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || "Login failed. Check server status, CORS, and SANCTUM_STATEFUL_DOMAINS.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Show error alert without breaking the form
  if (error) {
    return (
      <div className="flex flex-col gap-3 items-center justify-center h-screen">
        <Alert className="max-w-md">
          <AlertTitle className="text-xl font-bold mb-2">Login Error</AlertTitle>
          <AlertDescription className="text-lg mb-4">
            {error}
          </AlertDescription>
          <div className="flex gap-2">
            <Button 
              onClick={() => setError(null)} 
              variant="outline"
            >
              Try Again
            </Button>
            <Link href="/SignUp">
              <Button variant="secondary">
                Create Account
              </Button>
            </Link>
          </div>
        </Alert>
      </div>
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
              className="flex flex-col gap-4 mb-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email:</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        {...field} 
                        type="email"
                        disabled={loading}
                      />
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
                    <FormLabel className="text-foreground">Password:</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your password" 
                        {...field} 
                        type="password"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/SignUp" className="text-primary hover:underline font-medium">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}