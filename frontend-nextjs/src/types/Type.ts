import z from "zod";
// import isMobilePhone from 'validator/es/lib/isMobilePhone';
import { REGEX } from '@/constant/constant';

// auth
export const RegisterBody = z.object({
  email: z.string().email("email không hợp lệ"),
  fullname: z.string().min(5).max(60),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 kí tự').max(100).regex(REGEX, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'),
  confirmPassword: z.string().min(8, 'Mật khẩu tối thiểu 8 kí tự').max(100).regex(REGEX, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt')
})
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword']
      })
    }
  })
export type RegisterBodyType = z.TypeOf<typeof RegisterBody>

export const LoginBody = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(5, 'Mật khẩu quá yếu').max(100).regex(REGEX, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'),
}).strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

//contact
// export const ContactBody = z.object({
//   email: z.string().email("Email không hợp lệ"),
//   name: z.string().min(5, 'Hãy điền tên đầy đủ').max(100),
//   phone: z.string().refine((phone: string) => isMobilePhone(phone, 'vi-VN'), {
//     message: 'Số điện thoại không hợp lệ',
//   }),
//   topic: z.string().max(200, "Tiêu đề quá dài"),
//   content: z.string()
// }).strict()

// export type ContactBodyType = z.TypeOf<typeof ContactBody>

// submit user info
export const SubmitUserInfoBody = z.object({
  fullname: z.string().min(2).max(125),
  email: z.string().email(),
  address: z.string().min(5).max(255),
  dateOfBirth: z.string().min(10).max(10),
}).strict()

export type SubmitUserInfoBodyType = z.TypeOf<typeof SubmitUserInfoBody>

// chat-bot
export const Chatbot = z.object({
  message: z.string().max(255),
}).strict()

export type ChatbotType = z.TypeOf<typeof Chatbot>

//form-evaluation

export const EvaluateForm = z.object({
  score: z.string(),
  content: z.string().min(5).max(160),
})

export type EvaluationType = z.TypeOf<typeof EvaluateForm>

//form-active-course

export const ActiveCourseForm = z.object({
  code: z.string().min(1, "Mã không hợp lệ").max(25, "Mã không hợp lệ")
})

export type ActiveCourseType = z.TypeOf<typeof ActiveCourseForm>