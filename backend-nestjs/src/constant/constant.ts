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

export const expireTime = 6 * 30 * 24 * 60 * 60;

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export const staticFolders = [
  { path: 'uploads', prefix: '/uploads' },
  { path: 'courses', prefix: '/courses' },
  { path: 'lessons', prefix: '/lessons' },
];
