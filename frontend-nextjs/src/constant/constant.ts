export const enum UserRole {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}
export enum StatusLesson {
  STARTED = "STARTED",
  SUBMITTED = "SUBMITTED",
  COMPLETED = "COMPLETED",
}
export const REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const Headers: HeadersInit | undefined = {
  "Content-Type": "application/json",
  accept: "application/json",
};
export enum StatusAttendance {
  ON_TIME = "ON_TIME",
  LATE = "LATE",
}
export enum ChatAIMode {
  NORMAL = "NORMAL",
  IOT = "IOT",
}
export const HttpStatus = {
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
  CREATED: 201,
  BADREQUEST: 400,
  NOT_FOUND: 404,
};

export const Languages = [
  {
    name: "C",
    value: "c",
  },
  {
    name: "Python",
    value: "python",
  },
  {
    name: "JavaScript",
    value: "javascript",
  },
  {
    name: "Java",
    value: "java",
  },
  {
    name: "C++",
    value: "cpp",
  },
];

export enum Themes {
  DARK = "dark",
  LIGHT = "light",
}

export const ModeUpload = [
  {
    value: "COURSE",
    name: "Khóa học",
  },
  {
    value: "LESSON",
    name: "Bài học",
  },
  {
    value: "DEVICE",
    name: "Thiết bị",
  },
];

export enum ROLE_STEAM_PROJECT {
  LEADER = "LEADER",
  MEMBER = "MEMBER",
  LEADER_TEAM = "LEADER_TEAM",
}

export enum STATUS_TASK {
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
