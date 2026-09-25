import SignInForm from "@/features/signin/components/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | LMS EGS Admin",
  description: "Login Page LMS EGS Admin",
};

export default function SignIn() {
  return <SignInForm />;
}
