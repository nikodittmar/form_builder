'use client'

import Link from "next/link"
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

    return (
    <div className="mx-auto p-2 mt-3" style={{maxWidth: 500}}>
        <h1>Log In</h1>
        <form className="my-3">
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