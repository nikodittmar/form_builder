import { getAccount } from "@/modules/backend"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

async function getUser() {
    const cookieStore = cookies()
    const jwt = cookieStore.get("jwt")

    if (jwt == null) {
        return undefined
    }

    try {
        return await getAccount(jwt?.value)
    } catch {
        return undefined
    }
}

export default async function Page() {
    const user = await getUser()

    if (!user) {
        redirect('/login')
    }
    
    return (
    <div>
        <h1>My Account</h1>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
    </div>
    )
}