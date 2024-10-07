"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./Custominput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/actions/user.action";
import PlaidLink from "./PlaidLink";
// ... existing code ...

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState<string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    try {
      //Sign-up with appwrite  & create plaid link token
      const userData ={
        firstName:data.firstName!,
        lastName:data.lastName!,
        address1:data.address1!,
        city:data.city!,
        state:data.state!,
        zipCode:data.zipCode!,
        dob:data.dob!,
        ssn:data.ssn!,
        email:data.email,
        password:data.password,
      }
      if (type === "sign-up") {
        //create plaid link token
        const newUser = await signUp(userData);
        setUser(newUser);
      }
      if (type === "sign-in") {
        //sign-in with appwrite
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        console.log(response);
        if (response) {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link
          href="/"
          className="mb-12 cursor-pointer items-center  flex gap-1"
        >
          <Image src="/icons/logo.svg" alt="logo" width={32} height={32} />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3 ">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-16 font-normal  lg:text-16 text-gray-600">
            {user
              ? "Link your account to get started"
              : "Please enter your details"}
          </p>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant="primary"/>  
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex flex-row gap-2">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter your address"
                  />
                  <CustomInput
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="Enter your city"
                  />
                  <div className="flex flex-row gap-2">
                    <CustomInput
                      control={form.control}
                      name="state"
                      label="State"
                      placeholder="Enter your state"
                    />
                    <CustomInput
                      control={form.control}
                      name="zipCode"
                      label="Zip Code"
                      placeholder="Enter your zip code"
                    />
                  </div>
                  <div className="flex flex-row gap-2">
                    <CustomInput
                      control={form.control}
                      name="dob"
                      label="Date of Birth"
                      placeholder="yyyy-mm-dd"
                    />
                    <CustomInput
                      control={form.control}
                      name="ssn"
                      label="SSN"
                      placeholder="Enter your SSN"
                    />
                  </div>
                </>
              )}
              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
              />
              <div className="flex flex-col  w-full">
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      &nbsp;Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex flex-col justify-center gap-1">
            <div className="flex items-center gap-2">
              <p className="text-14  font-normal text-gray-600">
                {type === "sign-in"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <Link
                href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                className="form-link"
              >
                {type === "sign-in" ? "sign-up" : "sign-in"}
              </Link>
            </div>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
