"use client"

import { refreshToken } from "@/modules/backend"
import { getCookie, hasCookie } from "cookies-next"

export default function Page() {

    async function handlePress() {
        try {
            console.log(hasCookie("jwt"))
            const token: string = getCookie("jwt") as string
            const newToken = await refreshToken(token)
            console.log(await newToken)

        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
    }

    return (
    <div>
        <button className="btn btn-primary" onClick={handlePress}>Refresh Token</button>
    </div>
    )
}