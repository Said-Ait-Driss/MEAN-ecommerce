import { Injectable } from '@nestjs/common';
import { Storage } from '@squareboat/nest-storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
    async uploadLocalProducts(file: Express.Multer.File) {
        const filename = await this.generateFileName(file.originalname);
        const path = `uploads/products/${filename}`;

        const res = await Storage.disk('products_local').put(path, file.buffer);
        return { url: res.path };
    }

    async uploadLocalUsers(file: Express.Multer.File) {
        const filename = await this.generateFileName(file.originalname);
        const path = `uploads/users/${filename}`;

        const res = await Storage.disk('users_local').put(path, file.buffer);
        return { url: res.path };
    }

    async getFileUrlOfUser(filename: string) {
        const path = `uploads/products/${filename}`;
        return path;
    }

    async deleteFileOfUser(filename: string) {
        return Storage.disk('products_local').delete(filename);
    }

    async generateFileName(originalName: string) {
        const fileExtension = originalName.split('.').pop();
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;
        return uniqueFileName;
    }
}
