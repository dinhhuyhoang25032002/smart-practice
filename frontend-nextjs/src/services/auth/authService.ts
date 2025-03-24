import { fetchPublicData } from "@/utils/fetcher/fetch-api";

export const handleLogin = (email: string, password: string) => {
    return fetchPublicData('auth/login', {
        body: JSON.stringify(
            { email, password }
        ),
        method: "POST"
    })
}

export const handleSignUp = async (
    fullname: string,
    email: string,
    password: string,
    confirmPassword: string
) => {
    return await fetchPublicData("auth/register", {
        body: JSON.stringify(
            { fullname, email, password, confirmPassword }
        ),
        method: "POST"
    })
}

export const handleLogout = async () => {
    return await fetchPublicData('auth/logout')
}