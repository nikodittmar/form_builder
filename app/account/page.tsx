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

    /*
    if (!user) {
        redirect('/login')
    }
    */

    async function handleSignOut() {
        'use server'
        cookies().delete('jwt')
    }

    return (
    <div className="mx-auto p-2 mt-3" style={{maxWidth: 500}}>
        <h1>My Account</h1>
        <p>Username: {user?.username}</p>
        <p>Email: {user?.email}</p>
        <form action={handleSignOut}>
            <button className="btn btn-primary" type="submit">Sign Out</button>
        </form>
    </div>
    )
}