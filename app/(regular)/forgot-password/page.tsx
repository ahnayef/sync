import type { Metadata } from "next";
import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Verify an OTP and set a new password for your Loop account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}