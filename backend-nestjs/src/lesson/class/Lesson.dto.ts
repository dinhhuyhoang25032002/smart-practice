import type { ContentLesson, Item } from 'src/schema/lesson.schema';
import { PartialType } from '@nestjs/swagger';

export class LessonDto {

    readonly name: string;

    readonly linkImage: string;

    readonly content: ContentLesson[];

    readonly indexItem: Item[];

    readonly course: string;

    readonly idFrontLesson: string
}
export class UpdateLesson extends PartialType(LessonDto) { }