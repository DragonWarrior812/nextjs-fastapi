"use server"

import { redirect } from "next/navigation";

import {registerRegisterAuthRegisterPost} from "@/app/clientService";

export async function register(prevState: {}, formData: FormData) {
    const input = {
        "body": {
            "email": formData.get("email") as string,
            "password": formData.get("password") as string,
        }
    }
    const { error } = await registerRegisterAuthRegisterPost(input)
    if (error) {
        return {message: `${error.detail}`};
    }
    redirect(`/login`);
}