export enum StatusLesson {
  STARTED = 'STARTED',
  SUBMITTED = 'SUBMITTED',
  COMPLETED = 'COMPLETED',
}

export const enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export enum CommodityType {
  COURSE = 'COURSE',
  KIT = 'KIT',
  APP = 'APP',
}

export enum StatusAttendance {
  ON_TIME = 'ON_TIME',
  LATE = 'LATE',
}

export enum ShiftAttendance {
  MORNING = '8h-12h (Ca 1)',
  AFTERNOON = '13h-17h (Ca 2)',
}

export const expireTime = 6 * 30 * 24 * 60 * 60;

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export const staticFolders = [
  { path: 'tai-len', prefix: '/tai-len' },
  { path: 'khoa-hoc', prefix: '/khoa-hoc' },
  { path: 'bai-hoc', prefix: '/bai-hoc' },
];

export enum UpdateMode {
  COURSE = 'COURSE',
  LESSON = 'LESSON',
}

export enum STATUS_TASK {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
