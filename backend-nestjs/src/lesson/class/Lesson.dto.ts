// Trong Lesson.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

// Tạo các class DTO cho các type con
export class DataContentSideDto {
  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty({ required: false })
  description?: string;
}

export class DataSlideDto {
  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ type: [DataContentSideDto] })
  data: DataContentSideDto[];
}

export class DataContentPlusDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ type: [String], required: false })
  description?: string[];
}

export class DataPlusDto {
  @ApiProperty({ required: false })
  header?: string;

  @ApiProperty({ type: [DataContentPlusDto] })
  data: DataContentPlusDto[];
}

export class DataTabContentDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty({ type: [String], required: false })
  description?: string[];
}

export class DataTabDto {
  @ApiProperty({ required: false })
  header?: string;

  @ApiProperty({ type: [DataTabContentDto] })
  data: DataTabContentDto[];
}

export class ItemDto {
  @ApiProperty()
  nameItem: string;

  @ApiProperty()
  itemId: ObjectId;
}

export class DataListPropsDto {
  @ApiProperty({ required: false })
  header?: string;

  @ApiProperty({ type: [String], required: false })
  data?: string[];
}

export class DataContentMergeDto {
  @ApiProperty()
  label: string;

  @ApiProperty({ type: [DataContentPlusDto] })
  description: DataContentPlusDto[];
}

export class DataMergePropsDto {
  @ApiProperty({ required: false })
  header?: string;

  @ApiProperty({ type: [DataContentMergeDto], required: false })
  data?: DataContentMergeDto[];

  @ApiProperty({ required: false })
  image?: string;
}

export class DataVideoDto {
  @ApiProperty()
  url: string;

  @ApiProperty({ required: false })
  title?: string;
}

export class DataImageDto {
  @ApiProperty()
  url: string;

  @ApiProperty({ required: false })
  title?: string;
}

export class ContentLessonDto {
  @ApiProperty({ type: DataSlideDto, required: false })
  dataSlides?: DataSlideDto;

  @ApiProperty({ type: [String], required: false })
  contentText?: string[];

  @ApiProperty({ type: DataPlusDto, required: false })
  dataPlus?: DataPlusDto;

  @ApiProperty({ type: DataMergePropsDto, required: false })
  dataMerge?: DataMergePropsDto;

  @ApiProperty({ type: DataVideoDto, required: false })
  dataVideo?: DataVideoDto;

  @ApiProperty({ type: DataImageDto, required: false })
  dataImage?: DataImageDto;

  @ApiProperty({ type: DataTabDto, required: false })
  dataTab?: DataTabDto;

  @ApiProperty({ type: DataListPropsDto, required: false })
  dataList?: DataListPropsDto;

  @ApiProperty({ type: DataListPropsDto, required: false })
  dataList2?: DataListPropsDto;

  @ApiProperty({ required: false })
  codeSample?: string;
}

export class LessonDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly linkImage: string;

  @ApiProperty({ type: [ContentLessonDto] })
  readonly content: ContentLessonDto[];

  @ApiProperty({ type: [ItemDto] })
  readonly indexItem: ItemDto[];

  @ApiProperty()
  readonly course: string;

  @ApiProperty()
  readonly idFrontLesson: string;
}

export class UpdateLesson extends PartialType(LessonDto) { }