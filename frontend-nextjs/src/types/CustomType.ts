
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
  _id: string;
  studentId: {
    _id: string;
    fullname: string
  };
  lessonId: {
    _id: string;
    name: string
    linkImage: string
  };
  createdAt: string;
  isEvaluated: boolean;
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

