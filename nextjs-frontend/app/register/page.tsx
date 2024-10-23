"use client"

import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent, CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

import {register} from "@/components/actions/register-action";
import {useFormState, useFormStatus} from "react-dom";


export default function Page() {
    const [state, dispatch] = useFormState(register, {message: ""})
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <form action={dispatch}>
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Signup</CardTitle>
                        <CardDescription>
                            Enter your email and password below to create your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required/>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton/>
                        <div>{state?.message && <p>{state.message}</p>}</div>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}

function SubmitButton() {
    const {pending} = useFormStatus()
    return (
        <Button className="w-full" type="submit" disabled={pending}>Sign in</Button>
    )
}