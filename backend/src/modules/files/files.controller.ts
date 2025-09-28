import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
import { Roles } from '../auth/roles.decorator';

@Controller('files')
export class FilesController {
    constructor(private readonly photoService: FilesService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.USER, Role.CLEANER)
    @Post('upload/photo')
    @UseInterceptors(FileInterceptor('file'))
    async uploadOfCleaner(@Req() req, @UploadedFile() file: Express.Multer.File) {
        const user = req.user;
        if (user.role === Role.USER) {
            return await this.photoService.uploadLocalUsers(file);
        }
        // if user is cleaner
        return await this.photoService.uploadLocalCleaners(file);
    }
}
