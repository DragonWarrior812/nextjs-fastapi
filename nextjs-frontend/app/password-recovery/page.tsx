"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { passwordReset } from "@/components/actions/password-reset-action";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/ui/submitButton";
import Link from "next/link";

export default function Page() {
  const [state, dispatch] = useFormState(passwordReset, { message: "" });

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <form action={dispatch}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Password Recovery</CardTitle>
            <CardDescription>
              Enter your email to receive instructions to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <SubmitButton />
            <div>{state?.message && <p>{state.message}</p>}</div>
            <div className="mt-4 text-center text-sm">
              <Link href="/login" className="underline">
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
