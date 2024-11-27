"use server";

import { resetForgotPassword, resetResetPassword } from "@/app/clientService";
import { redirect } from "next/navigation";
import { passwordResetConfirmSchema } from "@/lib/definitions";

export async function passwordReset(prevState: {}, formData: FormData) {
  const input = {
    body: {
      email: formData.get("email") as string,
    },
  };

  const { error } = await resetForgotPassword(input);
  if (error) {
    return { message: `${error.detail}` };
  }
  return { message: "Password reset instructions sent to your email." };
}

export async function passwordResetConfirm(prevState: {}, formData: FormData) {
  const validatedFields = passwordResetConfirmSchema.safeParse({
    token: formData.get("resetToken") as string,
    password: formData.get("password") as string,
    passwordConfirm: formData.get("passwordConfirm") as string,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { token, password } = validatedFields.data;

  const input = {
    body: {
      token,
      password,
    },
  };
  const { error } = await resetResetPassword(input);
  if (error) {
    return { message: `${error.detail}` };
  }
  redirect(`/login`);
}
