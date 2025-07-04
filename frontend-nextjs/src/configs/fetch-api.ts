// /* eslint-disable @typescript-eslint/no-explicit-any */

// type CustomOptionRequest = RequestInit & {
//     baseUrl?: "NEST_ENDPOINT" | "BASE_URL" | undefined
// }

// const handleCallApi = async (method: string, fullUrl: string, options: CustomOptionRequest | undefined, body?: BodyInit | null | undefined, accessToken?: string | null) => {
//     const res = await fetch(fullUrl, {
//         ...options,
//         credentials: 'include',
//         headers: {
//             "Authorization": `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//             ...options?.headers
//         },
//         body,
//         method
//     })
//     return res
// }

// const request = async <Response>(method: "GET" | "POST" | "PUT" | "DELETE", url: string, options?: CustomOptionRequest | undefined) => {
//     try {
//         const body = options?.body ? JSON.stringify(options.body) : undefined
//         const access_token = localStorage.getItem('token-acccess')
//         const baseUrl = (options?.baseUrl === undefined || options?.baseUrl === "NEST_ENDPOINT") ? process.env.NEXT_PUBLIC_ENDPOINT : process.env.BASE_URL
//         const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : `${baseUrl}/${url}`
//         const res = await handleCallApi(method, fullUrl, options, body, access_token)
//         const payload: Response = await res.json()
//         const data = {
//             status: res.status,
//             payload
//         }
//         if (!res.ok) {
//             if (res.status === 401 && res.statusText === "Unauthorized") {
//                 try {
//                     const refresh = await fetch(`${baseUrl}/auth/refresh-token`, {
//                         credentials: 'include',
//                         method: 'GET',
//                         headers: { "Content-Type": "application/json", }
//                     }).then((res) => res.json())

//                     if (refresh.statusCode === 401 && refresh.message === "Unauthorized") {
//                         console.log('check refresh', refresh)
//                         localStorage.removeItem('token-acccess')
//                         await fetch(`${baseUrl}/auth/logout`, {
//                             credentials: 'include',
//                             method: 'GET',
//                             headers: { "Content-Type": "application/json", }
//                         }).then(async (res) => {
//                             if (res.ok && res.status === 200) {
//                                 window.location.replace('/auth')
//                             }
//                         })
//                         return;
//                     }
//                     else if (refresh.access_token) {
//                         localStorage.setItem("token-acccess", refresh.access_token);
//                         const res = await handleCallApi(method, fullUrl, options, body, refresh.access_token)
//                         const payload: Response = await res.json()
//                         const data = {
//                             status: res.status,
//                             payload
//                         }
//                         return data
//                     }
//                 } catch (error) {
//                     throw new Error(`Error call API:${error}`)
//                 }
//             }
//         }
//         return data
//     } catch (error) {
//         throw new Error(`Error call API:${error}`)
//     }
// }

// const http = {
//     get<Response>(url: string, options?: Omit<CustomOptionRequest, "body"> | undefined) {
//         return request<Response>("GET", url, options)
//     },
//     post<Response>(url: string, body: any, options?: Omit<CustomOptionRequest, "body"> | undefined) {
//         return request<Response>("POST", url, { ...options, body })
//     },
//     put<Response>(url: string, body: any, options?: Omit<CustomOptionRequest, "body"> | undefined) {
//         return request<Response>("PUT", url, { ...options, body })
//     },
//     delete<Response>(url: string, body?: any, options?: Omit<CustomOptionRequest, "body"> | undefined) {
//         return request<Response>("DELETE", url, { ...options, body })
//     },
// }
// export default http