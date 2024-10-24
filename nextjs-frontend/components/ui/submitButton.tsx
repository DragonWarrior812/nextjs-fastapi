import {useFormStatus} from "react-dom";
import {Button} from "@/components/ui/button";

export function SubmitButton() {
    const {pending} = useFormStatus()
    return (
        <Button className="w-full" type="submit" disabled={pending}>Sign in</Button>
    )
}