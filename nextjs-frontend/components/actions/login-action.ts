"use server"

import { cookies } from "next/headers";

import {authJwtLoginAuthJwtLoginPost } from "@/app/clientService";
import {redirect} from "next/navigation";


export async function login(prevState: {}, formData: FormData) {
    const input = {
        "body": {
            "username": formData.get("username") as string,
            "password": formData.get("password") as string,
        }
    }
    const { data, error } = await authJwtLoginAuthJwtLoginPost(input)
    if (error) {
        return {message: `${error.detail}`};
    }
    cookies().set("accessToken", data.access_token);
    redirect(`/dashboard`);
}