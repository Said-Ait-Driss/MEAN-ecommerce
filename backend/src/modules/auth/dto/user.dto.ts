import { IsDefined, IsEmail, isNotEmpty, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export interface IUserResponse {
    id?: string;
    role?: string;
    name?: string;
    email?: string;
    createdAt?: Date;
    photo_url?: string;
}

export class UserDto {
    id?: string;
    email: string;
    name: string;
    role: Role;
    createdAt?: Date;
    password?: string;
    salt?: string;
    photo_url?: string;

    constructor(data?: Partial<any>) {
        if (data) {
            const allowedProperties = ['id', 'name', 'email', 'createdAt', 'role', 'password', 'salt', 'photo_url'];

            allowedProperties.forEach((prop) => {
                if (data.hasOwnProperty(prop)) {
                    this[prop] = data[prop];
                }
            });
        }
    }

    toResponse(includePrivateInfo = false, isAdmin?: boolean): IUserResponse {
        const publicInfo = {
            id: this.id,
            name: this.name,
            role: this.role,
            email: this.email,
            photo_url: this['photo_url'],
        };

        const privateInfo = {
            email: this.email,
            createdAt: this.createdAt,
            role: this.role,
            salt: this.salt,
        };

        if (isAdmin) {
            return {
                ...publicInfo,
                ...privateInfo,
            };
        }

        if (!includePrivateInfo) {
            return publicInfo;
        }
        return {
            ...publicInfo,
            ...privateInfo,
        };
    }

    toProfile() {
        const profile = {
            id: this.id,
            name: this.name,
            role: this.role,
            email: this.email,
            photo_url: this.photo_url,
        };
        return profile;
    }
}
