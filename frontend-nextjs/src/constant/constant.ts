export const enum UserRole {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER"
}

export const REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

export const Headers: HeadersInit | undefined = {
  "Content-Type": "application/json",
  "accept": "application/json",
}