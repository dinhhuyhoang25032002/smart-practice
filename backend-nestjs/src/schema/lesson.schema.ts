import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';

type dataContentSide = {
  image?: string;
  description?: string;
}

type dataSlide = {
  title?: string
  data: dataContentSide[]
};

type dataContentPlus = {
  title: string;
  description?: Array<string>;
};

type dataPlus = {
  header?: string;
  data: dataContentPlus[]
}

type dataTabContent = {
  title: string;
  image?: string;
  description?: Array<string>;
}
type dataTab = {
  header?: string
  data: dataTabContent[]
};
export type Item = {
  nameItem: string;
  itemId: ObjectId
};

export type dataListProps = {
  header?: string;
  data?: Array<string>;
};

type dataContentMerge = {
  label: string;
  description: dataContentPlus[];
};

type dataVideo = {
  url: string,
  title?: string
}
type dataImage = {
  url: string,
  title?: string
}
export type dataMergeProps = {
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
  codeSample?: string
}


@Schema()
class ItemSchema extends Document {
  @Prop({ required: true })
  nameItem: string;
}

@Schema({ timestamps: true })
export class Lesson extends Document {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  linkImage: string;

  @Prop({ type: Array<ContentLesson>, required: true })
  content: ContentLesson[];

  @Prop({ type: [ItemSchema], required: true })
  indexItem: ItemSchema[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  course: ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  idFrontLesson: ObjectId

}
export const LESSON_MODEL = Lesson.name;
export const LessonSchema = SchemaFactory.createForClass(Lesson);
