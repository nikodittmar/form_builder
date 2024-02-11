'use client'

import { login } from "@/modules/backend"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
    const [form, setForm] = useState({
        usernameOrEmail: {
            value: "",
            focused: false
        }, 
        password: {
            value: "",
            focused: false
        }
    })
    const [showingPassword, setShowingPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const router = useRouter()

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setForm({...form, [name]: {...form[name as keyof typeof form], value: value}})
    }

    function handleBlur(event: React.ChangeEvent<HTMLInputElement>) {
        const { name } = event.target;
        setForm({...form, [name]: {...form[name as keyof typeof form], focused: true}})
    }

    function usernameOrEmailHasError() {
        return (form.usernameOrEmail.value.length === 0 && form.usernameOrEmail.focused)
    }

    function passwordHasError() {
        return (form.password.value.length === 0 && form.password.focused)
    }

    function submitDisabled() {
        return (form.usernameOrEmail.value.length === 0 || form.password.value.length === 0)
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        try {
            let response = await login(form.usernameOrEmail.value, form.password.value)

            const expirationDate = new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 7)

            document.cookie = `jwt=${await response.token}; expires=${expirationDate.toUTCString()}; SameSite=None; Secure;`;
            
            router.push("/account")
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message)
            }
        }
    }

    return (
    <div className="mx-auto p-2 mt-3" style={{maxWidth: 500}}>
        <h1>Log In</h1>
        <div className="alert alert-danger mt-3" hidden={errorMessage.length === 0} role="alert">
            {errorMessage}
        </div>
        <form className="my-3" onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Username or Email</label>
                <input 
                    type="text" 
                    name="usernameOrEmail" 
                    className={`form-control ${usernameOrEmailHasError() && "is-invalid"}`}
                    value={form.usernameOrEmail.value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <div className="invalid-feedback" >Please enter your username or email.</div>
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input 
                    type={showingPassword ? "text" : "password"}
                    name="password" 
                    className={`form-control ${passwordHasError() && "is-invalid"}`}
                    value={form.password.value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <div className="invalid-feedback" >Please enter your password.</div>
            </div>
            <div className="mb-3 form-check">
                <input 
                    type="checkbox" 
                    name="rememberMe"
                    className="form-check-input"
                    checked={showingPassword}
                    onChange={() => setShowingPassword(!showingPassword)}
                />
                <label className="form-check-label">Show Password</label>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitDisabled()}>Log In</button>
        </form>
        <Link href="/signup">Don't have an account?</Link>
    </div>
    )
}