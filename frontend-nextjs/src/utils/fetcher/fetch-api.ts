import { toastNotiFail } from "@/components/custom/ToastNotification";
import { UserProps } from "@/types/CustomType";
import { jwtDecode } from "jwt-decode";

export const fetchPublicData = async (url: string, options?: RequestInit) => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_ENDPOINT;
        const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

        const response = await fetch(fullUrl, {
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                ...options?.headers,
            },
            ...options,

        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.log(`Fetch error: ${error instanceof Error ? error : "Unknown error"});
        
       // throw new Error(`);
    }
};


const handleFetchApi = async (url: string, accessToken: string, options?: RequestInit) => {
    try {
        const res = await fetch(url, {
            ...options,
            credentials: "include",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                ...options?.headers,
            },
            cache: "no-cache",
        });

        if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.log(`Fetch error:  ${error instanceof Error ? error : "Unknown error"}`);
        //   throw new Error(`Fetch error:  ${error instanceof Error ? error : "Unknown error"}`);
    }
};

const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode(token);
        const exp = decoded.exp as number;
        const currentTime = Math.floor(Date.now() / 1000);
        return exp < currentTime;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true; // Coi như token đã hết hạn nếu có lỗi
    }
};

export const fetchPrivateData = async (url: string, options?: RequestInit) => {
    console.log(url);
    const s: string | null = localStorage.getItem("s")
    const userInfo: UserProps = s ? JSON.parse(s) : "";
    const { act } = userInfo;
    const baseUrl = process.env.NEXT_PUBLIC_ENDPOINT;
    const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

    if (!act) {
        console.log("Access Token is not exist!");
        return;
    }

    if (isTokenExpired(act)) {
        console.log("Token expired, refreshing token...");
        try {
            const refreshResponse = await fetch(`${baseUrl}/auth/refresh-token`, {
                credentials: "include",
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const refreshData = await refreshResponse.json();

            if (refreshResponse.status === 401 || refreshData.message === "Unauthorized") {
                await fetch(`${baseUrl}/auth/logout`, {
                    credentials: "include",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "accept": "application/json"
                    },
                });

                localStorage.removeItem("isAuth")
                localStorage.removeItem("s")
                window.location.href = "/dang-nhap";
                toastNotiFail("Unauthorized: Please log in again.");
                return
            }

            const newUser = {
                ...userInfo,
                act: refreshData.accessToken,
            };
            localStorage.setItem("s", JSON.stringify(newUser))
            return await handleFetchApi(fullUrl, refreshData.accessToken, options);
        } catch (error) {
            console.error("Error refreshing token:", error);
            throw error;
        }
    }
    return await handleFetchApi(fullUrl, act, options);
};