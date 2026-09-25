"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
// import { useSignIn } from "../hooks/useSignIn";
import { EyeIcon, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // TODO: Rate Limiting - akan diaktifkan nanti saat dibutuhkan
  /*
  const [cooldown, setCooldown] = useState(0);

  const { mutate: signInMutation, isPending, isError, error, reset } = useSignIn();

  useEffect(() => {
    if (isError && error?.message) {
      const match = error.message.match(/dalam (\d+) menit/);
      if (match) {
        setCooldown(parseInt(match[1], 10) * 60);
      }
    }
  }, [isError, error]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (cooldown === 0 && isError && error?.message?.includes("Terlalu banyak")) {
      // Waktu tunggu selesai, reset error dari TanStack Query
      reset();
    }
  }, [cooldown, isError, error, reset]);
  */
  // const { mutate: signInMutation, isPending, isError, error } = useSignIn();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // signInMutation({ email, password });
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full bg-white dark:bg-white/5 p-6 sm:p-12">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-lg dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Input
                    label="Email"
                    isRequired
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    placeholder="info@gmail.com"
                    type="email"
                    autoComplete="email"
                    // error={!!errors.email}
                    // hint={errors.email}
                  />
                </div>
                <div>
                  <Input
                    label="Password"
                    isRequired
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors((prev) => {
                          const { password, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    // error={!!errors.password}
                    // hint={errors.password}
                    rightIcon={
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeOff className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    }
                  />
                </div>
                <div className="flex items-center justify-end">
                  {/* <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link> */}
                </div>
                <div>
                  {/* TODO: Rate Limiting - uncomment below when needed */}
                  {/*
                  <Button
                    disabled={isPending || cooldown > 0}
                    className="w-full"
                    size="sm"
                    type="submit"
                  >
                    {isPending ? "Signing in..." : cooldown > 0 ? `Tunggu ${cooldown}s` : "Sign in"}
                  </Button>
                  */}
                  <Button
                    variant="primary"
                    // disabled={isPending}
                    className="w-full"
                    size="sm"
                    type="submit"
                  >
                    {/* {isPending ? "Signing in..." : "Sign in"} */}
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
