import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
    constructor(private readonly configService: ConfigService) { }
    async handleUploadImage(file: Express.Multer.File) {
        const NEST_ENDPOINT_STATIC_URL = this.configService.get<string>("NEST_ENDPOINT_STATIC_URL")
        const url = `${NEST_ENDPOINT_STATIC_URL}/${file.path.replace(/\\/g, '/')}`
        return {
            status: HttpStatus.CREATED,
            message: "Upload Image successfully!",
            url
        }
    }
}
