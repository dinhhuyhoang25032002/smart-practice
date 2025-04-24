
export type Production = {
  productionId: string;
  productionType: string;
};

export type UserJWT = {
  sub: string,
  role: string
}

export type PopulatedResult = {
  _id: string;
  studentId: {
    fullName: string;
  };
  name: string;
  isEvaluated: boolean;
  content: string;
  lessonId: {
    _id: string;
    name: string;
    linkImage: string;
    course: {
      _id: string;
      name: string;
    }
  }
  createdAt: string;
}

export type PopulatedLesson = {
  _id: string;
  name: string;
}

export type PopulatedDeadline = {

  userId: string;
  productionId: {
    _id: string;
    name: string;
    lessons: Array<string>;
  };
  productionType: string;

}