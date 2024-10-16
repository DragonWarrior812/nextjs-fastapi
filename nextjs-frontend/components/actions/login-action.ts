"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {authJwtLoginAuthJwtLoginPost} from "@/app/client";

export default async function login(formData: FormData) {
    const input = {
        "body": {
            "username": formData.get("username") as string,
            "password": formData.get("password") as string,
        }
    }
    const { data, error } = await authJwtLoginAuthJwtLoginPost(input)
    if (error) {
        redirect(`/login?message=${error.detail}`);
    }
    cookies().set("access_token", data.access_token);
}