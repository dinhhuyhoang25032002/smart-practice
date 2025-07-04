import { Body, Controller, ForbiddenException, HttpStatus, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadsService } from 'src/uploads/uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Request } from 'express';
import { UserJWT } from 'src/types/CustomType';
import { UserRole } from 'src/constant/constant';
import { UploadsDto } from 'src/uploads/class/Uploads.dto';
@Controller('uploads')
export class UploadsController {

    constructor(
        private readonly uploadsService: UploadsService
    ) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadsDto })
    @UseInterceptors(FileInterceptor("image"))
    uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request
    ) {
        // const { role } = req.user as UserJWT;
        // if (role !== UserRole.TEACHER) {
        //     return new ForbiddenException();
        // }

        return this.uploadsService.handleUploadImage(file);
    }
}
