import { UserProps } from "@/types/CustomType";

export const handleGetUserInfor = () => {
    if (typeof window === "undefined") return { _id: "", act: "" };
    const s = localStorage.getItem("s");
    if (s) {
        try {
            const { _id, act }: UserProps = JSON.parse(s);
            return { _id, act };
        } catch (error) {
            console.error("Failed to parse user info from localStorage:", error);
            return { _id: "", act: "" };
        }
    }
    return { _id: "", act: "" };
};

export const handleGetIsAuth = () => {
    if (typeof window === "undefined") return { _id: "", act: "" };
    const isAuth = localStorage.getItem("isAuth");
    if (isAuth) {
        try {
            return JSON.parse(isAuth) === true;
        } catch (error) {
            console.error("Failed to parse isAuth from localStorage:", error);
            return false;
        }
    }
    return false;
};