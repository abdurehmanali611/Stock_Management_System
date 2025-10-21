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
import { set } from "date-fns";

const formSchema = z.object({
  business_name: z.string().toLowerCase(),
  business_type: z.string().toLowerCase(),
  admin_name: z.string().toLowerCase(),
  email: z.string().email("Please Enter Valid Email"),
  password: z.string().min(6, "Password must be greater than 6"),
  AdministratorConfirmPassword: z
    .string()
    .min(6, "Password should be the same as the above"),
  phone: z
    .string()
    .min(10, "Please Enter Valid phone Number"),
  currency: z.string().toLowerCase(),
});

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
      setError(null)

      if (
        values.password !== values.AdministratorConfirmPassword
      ) {
        setError("Passwords do not match");
        console.log("Password mismatch error")
        setLoading(false);
        return;
      }

      const user_data = {
        name: values.admin_name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      };

      let Token = ""
      try {
        const registeredResponse = await axios.post("http://localhost:8000/api/register", user_data);
        Token = registeredResponse.data.Token;
        localStorage.setItem("sanctum_token", Token);
      } catch (error:any) {
        setLoading(false)
        console.log(error.message)
        const errorMessage = (error as any).response?.data?.message || "An unexpected error occurred";
        setError(errorMessage);
        return;
      }

      const business_data = {
        business_name: values.business_name,
        business_type: values.business_type,
        currency: values.currency,
        admin_name: values.admin_name
      };

      try {
        await axios.post("http://localhost:8000/api/addBusiness", business_data, {
          headers: {
            'Authorization': `Bearer ${Token}`
          }
        })
        localStorage.removeItem("sanctum_token");
        router.push("/Dashboard");
      } catch (error:any) {
        setLoading(false)
        console.log(error.message)
        const errorMessage = (error as any).response?.data?.message || "An unexpected error occurred";
        localStorage.removeItem("sanctum_token");
        setError(errorMessage);
        return;
      }finally {
        setLoading(false)
      }
  }

  if (error != null) {
    return <Alert>
      <AlertTitle className="text-2xl font-bold mb-2">Registration Error</AlertTitle>
      <AlertDescription className="text-lg">
        {error}
      </AlertDescription>
    </Alert>
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
                      <FormLabel>Full Name</FormLabel>
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
                      <FormLabel>Business Name</FormLabel>
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
                      <FormLabel>Business Type</FormLabel>
                      <FormControl className="self-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex justify-between"
                            >
                              <p>Business Name</p>
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
                      <FormLabel>Currency</FormLabel>
                      <FormControl className="self-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex justify-between"
                            >
                              <p>Currency</p>
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
                      <FormLabel>Email</FormLabel>
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
                      <FormLabel>Phone Number</FormLabel>
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter Your password" />
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
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Confirm your password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="mt-7">
                  {loading ? "Navigating..." : "Register"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
