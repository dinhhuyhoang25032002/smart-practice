export const enum UserRole {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER"
}
export enum StatusLesson {
  STARTED = "STARTED",
  SUBMITTED = "SUBMITTED",
  COMPLETED = "COMPLETED"
}
export const REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

export const Headers: HeadersInit | undefined = {
  "Content-Type": "application/json",
  "accept": "application/json",
}
export enum StatusAttendance {
  ON_TIME = 'ON_TIME',
  LATE = 'LATE',
}

export const HttpStatus = {
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
  CREATED: 201,
  BADREQUEST:400
}