export const enum UserRole {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER"
}

export const REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/