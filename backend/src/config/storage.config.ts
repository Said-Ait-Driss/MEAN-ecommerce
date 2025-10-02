import { resolve } from 'path';
import { registerAs } from '@nestjs/config';

export default registerAs('filesystem', () => ({
    default: 'local',
    disks: {
        local: {
            driver: 'local',
            root: resolve(process.cwd(), 'uploads'), // folder for local storage
        },
        products_local: {
            driver: 'local',
            root: resolve(process.cwd(), 'uploads', 'products'), // folder for local storage
        },
        users_local: {
            driver: 'local',
            root: resolve(process.cwd(), 'uploads', 'users'), // folder for local storage
        },
        s3: {
            driver: 's3',
            key: process.env.AWS_ACCESS_KEY_ID,
            secret: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
            bucket: process.env.AWS_BUCKET,
        },
    },
}));
