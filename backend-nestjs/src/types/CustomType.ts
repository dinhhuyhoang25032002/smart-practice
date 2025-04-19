
import { Types } from "mongoose";


export type Production = {
  productionId: string;
  productionType: string;
};


export type UserJWT = {
  sub: string,
  role: string
}

export type PopulatedLesson = {
  _id: Types.ObjectId;
  name: string;
};
