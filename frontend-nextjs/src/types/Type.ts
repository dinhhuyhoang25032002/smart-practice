import z from "zod";
// import isMobilePhone from 'validator/es/lib/isMobilePhone';
import { REGEX } from "@/constant/constant";

// auth
export const RegisterBody = z
  .object({
    email: z.string().email("email không hợp lệ"),
    fullname: z.string().min(5).max(60),
    password: z
      .string()
      .min(8, "Mật khẩu tối thiểu 8 kí tự")
      .max(100)
      .regex(
        REGEX,
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
      ),
    confirmPassword: z
      .string()
      .min(8, "Mật khẩu tối thiểu 8 kí tự")
      .max(100)
      .regex(
        REGEX,
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
      ),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });
export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export const LoginBody = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(5, "Mật khẩu quá yếu")
      .max(100)
      .regex(
        REGEX,
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
      ),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

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
export const SubmitUserInfoBody = z
  .object({
    fullname: z.string().min(2).max(125),
    email: z.string().email(),
    address: z.string().min(5).max(255),
    dateOfBirth: z.string().min(10).max(10),
  })
  .strict();

export type SubmitUserInfoBodyType = z.TypeOf<typeof SubmitUserInfoBody>;

// chat-bot
export const Chatbot = z
  .object({
    message: z.string().max(255),
  })
  .strict();

export type ChatbotType = z.TypeOf<typeof Chatbot>;

//form-evaluation

export const EvaluateForm = z.object({
  score: z.string(),
  content: z.string().min(5).max(160),
});

export type EvaluationType = z.TypeOf<typeof EvaluateForm>;

//form-active-course

export const ActiveCourseForm = z.object({
  code: z.string().min(1, "Mã không hợp lệ").max(25, "Mã không hợp lệ"),
});

export type ActiveCourseType = z.TypeOf<typeof ActiveCourseForm>;

//form-create-a-course
export const CreateACourseForm = z.object({
  name: z.string().min(1, "Tên khóa học không được để trống"),
  code: z.string().min(1, "Mã khóa học không được để trống"),
  description: z.string().min(1, "Mô tả khóa học không được để trống"),
  price: z.string().min(0, "Giá khóa học không được để trống"),
  image:
    typeof window !== "undefined"
      ? z.instanceof(File, { message: "Vui lòng chọn ảnh khóa học" })
      : z.any(),
  video: z.string().min(1, "Mô tả khóa học không được để trống").optional(),
});
export type CreateACourseFormType = z.TypeOf<typeof CreateACourseForm>;

// form-edit-course
export const EditCourseForm = z.object({
  name: z.string().min(1, "Tên khóa học không được để trống"),
  code: z.string().min(1, "Mã khóa học không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  price: z.string().min(1, "Giá khóa học không được để trống"),
  type: z.string().min(1, "Loại khóa học không được để trống"),
  video: z.string().optional(),
  image: z.string().optional(),
});
export type EditCourseFormType = z.TypeOf<typeof EditCourseForm>;

// form-edit-lesson
// Định nghĩa các schema con
const dataSlideSchema = z.object({
  title: z.string().optional(),
  data: z.array(z.object({
    image: z.string(),
    description: z.string().optional(),
  })),
});

const dataContentPlusSchema = z.object({
  title: z.string(),
  description: z.array(z.string()).optional(),
});

const dataPlusSchema = z.object({
  header: z.string().optional(),
  data: z.array(dataContentPlusSchema),
});

const dataTabContentSchema = z.object({
  title: z.string(),
  image: z.string().optional(),
  description: z.array(z.string()).optional(),
});

const dataTabSchema = z.object({
  header: z.string().optional(),
  data: z.array(dataTabContentSchema),
});

const dataListSchema = z.object({
  header: z.string().optional(),
  data: z.array(z.string()).optional(),
});

const dataContentMergeSchema = z.object({
  label: z.string(),
  description: z.array(dataContentPlusSchema),
});

const dataVideoSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
});

const dataImageSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
});

const dataMergeSchema = z.object({
  header: z.string().optional(),
  data: z.array(dataContentMergeSchema).optional(),
  image: z.string().optional(),
});

const contentLessonSchema = z.object({
  dataSlides: dataSlideSchema.optional(),
  contentText: z.array(z.string()).optional(),
  dataPlus: dataPlusSchema.optional(),
  dataMerge: dataMergeSchema.optional(),
  dataVideo: dataVideoSchema.optional(),
  dataImage: dataImageSchema.optional(),
  dataTab: dataTabSchema.optional(),
  dataList: dataListSchema.optional(),
  dataList2: dataListSchema.optional(),
  codeSample: z.string().optional(),
});

const indexItemSchema = z.object({
  _id: z.string(),
  nameItem: z.string(),
});


export const EditLessonForm = z.object({
  name: z.string().min(1, "Tên bài học không được để trống"),
  content: z.array(contentLessonSchema).min(1, "Nội dung bài học không được để trống"),
  indexItem: z.array(indexItemSchema).min(1, "Mục lục bài học không được để trống"),
  course: z.object({
    _id: z.string().optional(),
    name: z.string(),
  }),
  idFrontLesson: z.object({
    _id: z.string().optional(),
    name: z.string(),
  }),
  video: z.string().optional(),
  image: z.string().optional(),
});

export type EditLessonFormType = z.infer<typeof EditLessonForm>;


export const AddLessonForm = z.object({
  name: z.string().min(1, "Tên bài học không được để trống"),
  course: z.string().min(1, "Tên bài học không được để trống"),
});
export type AddLessonFormType = z.infer<typeof AddLessonForm>;

