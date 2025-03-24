import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
@Injectable()
export class StarttimeService {
    constructor() { }

    async handleGetSlugLesson(name: string) {
        return slugify(name, { locale: "vi", lower: true })
    }
}
