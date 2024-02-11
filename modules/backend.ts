const ENDPOINT = "http://localhost:3001/api/v1"

export async function signup(username: String, email: String, password: String) {
    const body = { "user": { "username": username, "email": email, "password": password } }
    const response = await fetch(ENDPOINT + "/users", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })

    if (response.ok) {
        return await response.json()
    } else {
        let body = await response.json()
        if (response.status == 422 && body.hasOwnProperty("errors") && body.errors.length > 0) {
            throw new Error(await body.errors[0])
        } else {
            throw new Error("We ran into an unexpected error, please try again later.")
        }
    }
}

export async function login(identifier: String, password: String) {
    const body = { "identifier": identifier, "password": password }
    const response = await fetch(ENDPOINT + "/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
    
    if (response.ok) {
        return await response.json()
    } else {
        if (response.status == 404 || response.status == 401) {
            throw new Error("Incorrect username or password.")
        } else {
            throw new Error("We ran into an unexpected error, please try again later.")
        }
    } 
}

export async function refreshToken(token: string) {
    const response = await fetch (ENDPOINT + "/auth/refresh-token", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })

    if (response.ok) {
        return await response.json()
    } else if (response.status == 401) {
        throw new Error("Unauthorized.")
    } else if (response.status == 404) {
        throw new Error("User not found.")
    } else {
        throw new Error("We ran into an unexpected error, please try again later.")
    }
}

export async function getAccount(token: string) {
    const response = await fetch (ENDPOINT + "/auth/account", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })

    if (response.ok) {
        return await response.json()
    } else if (response.status == 401) {
        throw new Error("Unauthorized.")
    } else if (response.status == 404) {
        throw new Error("User not found.")
    } else {
        throw new Error("We ran into an unexpected error, please try again later.")
    }
}