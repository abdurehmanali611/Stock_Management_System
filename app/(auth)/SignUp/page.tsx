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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  business_name: z.string().min(2, "Please enter your business name").toLowerCase(),
  business_type: z.string().min(1, "Please Select your business Type").toLowerCase(),
  admin_name: z.string().min(2, "Please Enter Your name").toLowerCase(),
  email: z.string().email("Please Enter Valid Email"),
  password: z.string().min(6, "Password must be greater than 6"),
  AdministratorConfirmPassword: z
    .string()
    .min(6, "Password should be the same as the above"),
  phone: z
    .string()
    .min(10, "Please Enter Valid phone Number"),
  currency: z.string().min(2, "Please Select Your Currency type").toLowerCase(),
});

// Helper function to get cookie
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
  withCredentials: true,
})

// Add request interceptor to include CSRF token automatically
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

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: "",
      business_type: "",
      admin_name: "",
      email: "",
      password: "",
      AdministratorConfirmPassword: "",
      phone: "",
      currency: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    setLoading(true);
    setError(null);

    if (values.password !== values.AdministratorConfirmPassword) {
      setError("Passwords do not match");
      console.log("Password mismatch error");
      setLoading(false);
      return;
    }

    const user_data = {
      name: values.admin_name,
      email: values.email,
      phone: values.phone,
      password: values.password,
    };

    const business_data = {
      business_name: values.business_name,
      business_type: values.business_type,
      currency: values.currency,
      admin_name: values.admin_name
    };

    try {
      // Get CSRF token first
      await getCsrfCookie();
      
      // Register user
      const registerResponse = await api.post("/register", user_data);
      console.log("User registered:", registerResponse.data);

      // Add business - the interceptor will automatically add X-XSRF-TOKEN
      const businessResponse = await api.post("/addBusiness", business_data);
      console.log("Business added:", businessResponse.data);

      router.push("/Dashboard");
    } catch (error: any) {
      console.log("Full error:", error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || "An unexpected error occurred";
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
          <AlertTitle className="text-2xl font-bold mb-2">Registration Error</AlertTitle>
          <AlertDescription className="text-lg">
            {error}
          </AlertDescription>
          <Button 
            onClick={() => setError(null)} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 items-center justify-center h-screen">
      <Card>
        <CardHeader className="items-center">
          <CardTitle>Register</CardTitle>
          <CardDescription>Register Your Business Here</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex gap-10 items-start"
            >
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="admin_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter Your name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Business Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter Your Business Name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="business_type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="text-foreground">Business Type</FormLabel>
                      <FormControl className="self-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex justify-between"
                            >
                              <p>{field.value || "Business Type"}</p>
                              <Image
                                src="/dropdown.webp"
                                alt="DropDown"
                                width={38}
                                height={38}
                                className="rounded-full"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Type:</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {[
                              "Retail",
                              "Manufacturing",
                              "Importer",
                              "Distributer",
                              "Exporter",
                              "Service Provider",
                            ].map((cur) => (
                              <DropdownMenuItem
                                key={cur}
                                onSelect={() => field.onChange(cur)}
                              >
                                {cur}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="text-foreground">Currency</FormLabel>
                      <FormControl className="self-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex justify-between"
                            >
                              <p>{field.value || "Currency Type"}</p>
                              <Image
                                src="/dropdown.webp"
                                alt="DropDown"
                                width={38}
                                height={38}
                                className="rounded-full"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Type:</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {["ETB", "USD", "EUR", "CAD", "AUD"].map((cur) => (
                              <DropdownMenuItem
                                key={cur}
                                onSelect={() => field.onChange(cur)}
                              >
                                {cur}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter Your email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter Your phone Number"
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
                      <FormLabel className="text-foreground">Password</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password"
                          placeholder="Enter Your password" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="AdministratorConfirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password"
                          placeholder="Confirm your password" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="mt-7" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}