"use server";

import { resetForgotPassword } from "@/app/clientService";

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
