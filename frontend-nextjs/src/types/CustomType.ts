import { ROLE_STEAM_PROJECT, STATUS_TASK } from "@/constant/constant";

type dataContentSide = {
  image: string;
  description?: string;
};
type dataSlide = {
  title?: string;
  data: dataContentSide[];
};

type dataContentPlus = {
  title: string;
  description?: Array<string>;
};
type dataPlus = {
  header?: string;
  data: dataContentPlus[];
};

type dataTabContent = {
  title: string;
  image?: string;
  description?: Array<string>;
};

type dataTab = {
  header?: string;
  data: dataTabContent[];
};

export type IndexItemProps = {
  nameItem: string;
  _id: string;
};
type dataListProps = {
  header?: string;
  data?: Array<string>;
};

type dataContentMerge = {
  label: string;
  description: dataContentPlus[];
};

type dataVideo = {
  url: string;
  title?: string;
};
type dataImage = {
  url: string;
  title?: string;
};
type dataMergeProps = {
  header?: string;
  data?: dataContentMerge[];
  image?: string;
};

export type ContentLesson = {
  dataSlides?: dataSlide;
  contentText?: Array<string>;
  dataPlus?: dataPlus;
  dataMerge?: dataMergeProps;
  dataVideo?: dataVideo;
  dataImage?: dataImage;
  dataTab?: dataTab;
  dataList?: dataListProps;
  dataList2?: dataListProps;
  codeSample?: string;
};
export type ContentLessonMerge = ContentLesson & { _id: string };

export type Lesson = {
  _id: string;
  content: Array<ContentLesson>;
  name: string;
  linkImage: string;
  video: string;
  indexItem: Array<IndexItemProps>;
  course: {
    _id: string;
    name: string;
  };
  idFrontLesson: {
    _id: string;
    name: string;
  };
};

export type SolutionContent = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  benefit: Array<string>;
  image: string;
  video: string;
  price: string;
  type: string;
};

export type CourseContent = SolutionContent & {
  code: string;
  lessons: Array<{
    _id: string;
    name: string;
    linkImage: string;
  }>;
};

type EvaluaDashboard = {
  lessonId: string;
  score: number;
  name: string;
};
export type EvaluaTions = {
  isComplete: boolean;
  startTime: string;
  nameCourse: string;
  dataResult: Array<EvaluaDashboard>;
};
export type Attendances = {
  _id: string;
  studentId: string;
  time: string;
  shift: string;
  day: string;
  status: string;
};
export type CourseInfor = {
  _id: string;
  userId: string;
  productionId: {
    _id: string;
    name: string;
    description: string;
    image: string;
    price: string;
    type: string;
    subType: string;
    startNumber: 4.5;
    lessons: Array<string>;
    deleted: false;
    slug: string;
    video: string;
    benefit: [];
    isSearch: string;
  };
  productionType: string;
};

export type UserProps = {
  act: string;
  _id: string;
};

export type ArrLessons = {
  _id: string;
  name: string;
};

export type CourseIsActive = {
  _id: string;
  name: string;
  lessons: Array<ArrLessons>;
};
export type CourseSearch = {
  name: string;
  _id: string;
};

export type ResponseException = {
  status: number;
  message: string;
  options: object;
  name: string;
  response: {
    message: string;
    statusCode: number;
    error: string;
  };
};

export type Results = {
  courseId: string;
  courseName: string;
  lessonNumber: number;
  lessons: Array<{
    lessonId: string;
    name: string;
    linkImage: string;
    studentId: {
      _id: string;
      fullname: string;
    };
    isEvaluated: boolean;
    createdAt: string;
  }>;
};

export type Result = {
  _id: string;
  studentId: {
    _id: string;
    fullname: string;
  };
  isEvaluated: boolean;
  lessonId: string;
  content: string;
  createdAt: string;
};

export type Evaluate = {
  _id: string;
  studentId: {
    _id: string;
    fullname: string;
  };
  teacherId: string;
  lessonId: {
    _id: string;
    name: string;
  };
  score: string;
  content: string;
  createdAt: string;
};

export type DataRecord = {
  _id: string;
  views: string;
  duration: string;
  nameItem: string;
};
export type DataTimeview = {
  _id: string;
  fullname: string;
  dataRecord: DataRecord[];
  nameLesson: string;
  status: string;
  startTime: string;
};

export type ChatResponse = {
  answer: string;
  session_id: string;
  model: string;
};

export type IoTResponse = {
  answer: string;
  session_id: string;
  model: string;
};

export type Document = {
  id: number;
  filename: string;
  upload_timestamp: string;
};

export type UploadResponse = {
  message: string;
  file_id: number;
};
export type MemberInfor = {
  completedTasks: number;
  memberId: { _id: string; fullname: string };
  role: ROLE_STEAM_PROJECT;
  teamNumber: string;
  totalTasks: number;
  createdAt: string;
};
export type SteamProjectInfo = {
  _id?: string;
  name: string;
  leader:
    | {
        _id: string;
        fullname: string;
      }
    | undefined;
  listMember: Array<MemberInfor>;
  description: string;
  startDate: string;
  endDate: string;
};

export type SteamTaskInfo = {
  _id?: string;
  createdAt: string;
  deadline: string;
  creator: string;
  name: string;
  projectId: string;
  startTime: string;
  description: string;
  status: STATUS_TASK;
  submitTime?: string;
  implementer?: {
    _id: string;
    fullname: string;
  } | null;
};
