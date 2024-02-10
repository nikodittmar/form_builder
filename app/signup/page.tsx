'use client'

import { signup } from "@/modules/backend";
import { validEmail } from "@/modules/email-validator";
import { setCookie } from "cookies-next";
import Link from "next/link"
import { useState } from "react"

export default function Page() {
    const [form, setForm] = useState({
        username: {
            value: "",
            focused: false,
        },
        email: {
            value: "",
            focused: false,
        },
        password: {
            value: "",
            focused: false,
        },
        passwordConfirmation: {
            value: "",
            focused: false,
        },
    })
    const [showingPassword, setShowingPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setForm({...form, [name]: {...form[name as keyof typeof form], value: value}})
    }

    function handleBlur(event: React.ChangeEvent<HTMLInputElement>) {
        const { name } = event.target;
        setForm({...form, [name]: {...form[name as keyof typeof form], focused: true}})
    }

    function usernameErrorMessage(): string {
        if (form.username.value.length === 0) {
            return "Username is required."
        } else if (/\s/.test(form.username.value)) {
            return "Username cannot have spaces."
        } else if (form.username.value.length > 30) {
            return "Username cannot be longer than 30 characters."
        } else {
            return ""
        }
    }

    function usernameHasError(): boolean {
        if (usernameErrorMessage() === "Username is required." && !form.username.focused) {
            return false
        } else {
            return (usernameErrorMessage() != "")
        }
    }

    function emailErrorMessage(): string {
        if (form.email.value.length === 0) {
            return "Email is required."
        } else if (!validEmail(form.email.value)) {
            return "Email must be valid."
        } else {
            return ""
        }
    }

    function emailHasError(): boolean {
        if (emailErrorMessage() === "Email is required." && !form.email.focused) {
            return false
        } else {
            return (emailErrorMessage() != "")
        }
    }

    function passwordStrength(): number {
        let passwordStrength = 0

        if (form.password.value.length > 0) {
            passwordStrength += 1
        }

        if (form.password.value.length >= 8) {
            passwordStrength += 1
        }
        if (/\d/.test(form.password.value)) {
            passwordStrength += 1
        }
        if (/(?=.*[a-z])(?=.*[A-Z])/.test(form.password.value)) {
            passwordStrength += 1
        }

        return passwordStrength
    }

    function meterWidth(): string {
        return `${passwordStrength() * 25}%`
    }

    function meterColor(): string {
        switch (passwordStrength()) {
            case 1:
                return 'FireBrick'
            case 2:
            case 3:
                return 'GoldenRod'
            case 4:
                return 'ForestGreen'
            default:
                return 'FireBrick'
        }
    }

    function passwordFeedback(): string {
        if (!form.password.focused && form.password.value.length === 0) {
            return "Enter a password."
        } else if (form.password.value.length === 0) {
            return "Password is Required."
        } else if (form.password.value.length < 8) {
            return "Password must be at least 8 characters."
        } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(form.password.value)) {
            return "Password must contain an uppercase and lowercase letter."
        } else if (!/\d/.test(form.password.value)) {
            return "Password must conntain a digit."
        } else {
            return "Password is strong."
        }
    }

    function passwordHasError(): boolean {
        return (form.password.focused && form.password.value.length === 0)
    }

    function confirmPasswordErrorMessage(): string {
        if (form.passwordConfirmation.value.length === 0) {
            return "Password confirmation is required."
        } else if (form.passwordConfirmation.value != form.password.value) {
            return "Passwords must match."
        } else {
            return ""
        }
    }

    function confirmPasswordHasError(): boolean {
        if (confirmPasswordErrorMessage() === "Password confirmation is required." && !form.passwordConfirmation.focused) {
            return false
        } else {
            return (confirmPasswordErrorMessage() != "")
        }
    }

    function submitDisabled(): boolean {
        if (form.username.value.length === 0 || 
            form.email.value.length === 0 || 
            form.password.value.length === 0 || 
            form.passwordConfirmation.value.length === 0 ) {
            return true
        } else if ( usernameHasError() ||
                    emailHasError() ||
                    passwordHasError() ||
                    confirmPasswordHasError()) {
            return true
        } else {
            return false
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        try {
            let response = await signup(form.username.value, form.email.value, form.password.value)
            console.log( await response)
            
            setCookie("jwt", await response.token, { 
                httpOnly: true, 
                secure: true, 
                expires: new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 7)
            })

        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message)
            }
        }
    }

    return (
    <div className="mx-auto p-2 mt-3" style={{maxWidth: 500}}>
        <h1>Sign Up</h1>
        <div className="alert alert-danger mt-3" hidden={errorMessage.length === 0} role="alert">
            {errorMessage}
        </div>
        <form className="my-3" autoComplete="off" onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Username</label>
                <input 
                    type="text" 
                    name="username" 
                    className={`form-control ${usernameHasError() && "is-invalid"}`}
                    value={form.username.value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <div className="invalid-feedback" >{usernameErrorMessage()}</div>
                
            </div>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input 
                    type="text" 
                    name="email" 
                    className={`form-control ${emailHasError() && "is-invalid"}`}
                    value={form.email.value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <div className="invalid-feedback" >{emailErrorMessage()}</div>
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
                <div className="rounded mt-2" style={{height: 6, backgroundColor: "Gainsboro"}}>
                    <div className="rounded" style={{height: 6, backgroundColor: meterColor(), width: meterWidth(), transition: "all 0.5s"}}></div>
                </div>
                <div className={passwordHasError() ? "invalid-feedback" : "form-text"}>{passwordFeedback()}</div>
            </div>
            <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input 
                    type={showingPassword ? "text" : "password"}
                    name="passwordConfirmation" 
                    className={`form-control ${confirmPasswordHasError() && "is-invalid"}`}
                    value={form.passwordConfirmation.value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <div className="invalid-feedback" >{confirmPasswordErrorMessage()}</div>
            </div>
            <div className="mb-3 form-check">
                <input 
                    type="checkbox" 
                    name="showPasswords"
                    className="form-check-input"
                    checked={showingPassword}
                    onChange={() => setShowingPassword(!showingPassword)}
                />
                <label className="form-check-label">Show Password</label>
            </div>
            <button type="submit" disabled={submitDisabled()} className="btn btn-primary">Sign Up</button>
        </form>
        <Link href="/login">Already have an account?</Link>
    </div>
    )
}