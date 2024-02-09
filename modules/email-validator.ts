export function validEmail(email: string): boolean {
    let emailRegex = /^\S+@\S+\.\S+$/
    return emailRegex.test(email)
}