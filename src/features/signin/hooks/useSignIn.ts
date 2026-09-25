"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn as nextAuthSignIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SignInCredentials {
    email: string;
    password: string;
}

export function useSignIn() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ email, password }: SignInCredentials) => {

            const result = await nextAuthSignIn("credentials", {
                email,
                pwd: password,
                redirect: false,
            });

            if (!result || result.error || !result.ok) {
                const errorMessage =
                    result?.error && result.error !== "CredentialsSignin"
                        ? result.error
                        : "Invalid email or password.";
                throw new Error(errorMessage);
            }

            return result;
        },
        onSuccess: () => {
            console.log("Login success");
            queryClient.clear();
            router.refresh();
            router.push("/");
        },
    })
}