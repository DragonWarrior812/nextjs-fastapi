"use server"

import { redirect } from "next/navigation";

import {registerRegister, RegisterRegisterError} from "@/app/clientService";

export async function register(prevState: {}, formData: FormData) {
    const input = {
        "body": {
            "email": formData.get("email") as string,
            "password": formData.get("password") as string,
        }
    }
    const { error } = await registerRegister(input)
    if (error) {
    return getErrorMessage(error)
}
    redirect(`/login`);
}

function getErrorMessage(error: RegisterRegisterError): { message: string } {
    let message = 'An unknown error occurred';

    if (typeof error.detail === 'string') {
        // If detail is a string, use it directly
        message = error.detail;
    } else if (Array.isArray(error.detail)) {
        // If detail is an array of ValidationError, extract the messages
        message = error.detail.map(err => err.msg).join('; ');
    } else if (typeof error.detail === 'object' && 'reason' in error.detail) {
        // If detail is an object with a 'reason' key, use that
        message = error.detail['reason'];
    }

    return { message };
}
