"use server";

import { cookies } from "next/headers";

import { authJwtLogin } from "@/app/clientService";
import { redirect } from "next/navigation";

export async function login(prevState: {}, formData: FormData) {
  const input = {
    body: {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    },
  };
  const { data, error } = await authJwtLogin(input);
  if (error) {
    return { message: `${error.detail}` };
  }
  (await cookies()).set("accessToken", data.access_token);
  redirect(`/dashboard`);
}
