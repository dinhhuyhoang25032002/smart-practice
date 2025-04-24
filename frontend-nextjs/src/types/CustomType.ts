

import { StaticImageData } from "next/image";

type dataContentSide = {
  image: string | StaticImageData;
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
  image?: string | StaticImageData;
  description?: Array<string>;
};

type dataTab = {
  header?: string;
  data: dataTabContent[];
};

export type IndexItemProps = {
  nameItem: string;
  _id: string
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
  url: string | StaticImageData;
  title?: string;
};
type dataMergeProps = {
  header?: string;
  data?: dataContentMerge[];
  image?: string | StaticImageData;
};

export class ContentLesson {
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
}
export type ContentLessonMerge = ContentLesson & { _id: string }

export type Lesson = {
  content: Array<ContentLesson>,
  name: string,
  indexItem: Array<IndexItemProps>
}

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

type EvaluaDashboard = {
  lessonId: string,
  score: number,
  name: string;
};
export type EvaluaTions = {
  isComplete: boolean,
  startTime: string,
  nameCourse: string,
  dataResult: Array<EvaluaDashboard>
}
export type Attendances = {
  _id: string,
  studentId: string
  time: string
  shift: string
  day: string
  status: string
}
export type CourseInfor = {
  _id: string,
  userId: string,
  productionId: {
    _id: string,
    name: string,
    description: string,
    image: string
    price: string,
    type: string,
    subType: string,
    startNumber: 4.5,
    lessons: Array<string>,
    deleted: false,
    slug: string,
    video: string,
    benefit: [],
    isSearch: string
  },
  productionType: string,
}

export type UserProps = {
  act: string;
  _id: string;
};

export type ArrLessons = {
  _id: string;
  name: string;
};

export type CourseIsActive = {
  _id: string,
  name: string,
  lessons: Array<ArrLessons>
}
export type CourseSearch = {
  name: string;
  _id: string;
};

export type ResponseException = {
  status: number;
  message: string;
  options: object;
  name: string
  response: {
    message: string;
    statusCode: number;
    error: string;
  }
}

export type Results = {
  courseId: string;
  courseName: string;
  lessonNumber: number;
  lessons: Array<{
    lessonId: string;
    name: string
    linkImage: string
    studentId: {
      _id: string;
      fullname: string
    };
    isEvaluated: boolean;
    createdAt: string;
  }>;
}

export type Result = {
  _id: string,
  studentId: {
    _id: string,
    fullname: string
  },
  isEvaluated: boolean
  lessonId: string,
  content: string,
  createdAt: string
}

export type Evaluate = {
  _id: string,
  studentId: {
    _id: string,
    fullname: string
  },
  teacherId: string,
  lessonId: {
    _id: string,
    name: string
  },
  score: string,
  content: string,
  createdAt: string
}


export type DataRecord = {
  _id: string,
  views: string,
  duration: string,
  nameItem: string
}
export type DataTimeview = {
  _id: string,
  fullname: string,
  dataRecord: DataRecord[],
  nameLesson: string,
  status: string,
  startTime: string
}