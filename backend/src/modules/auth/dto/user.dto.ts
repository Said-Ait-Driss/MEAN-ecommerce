import { IsDefined, IsEmail, isNotEmpty, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export interface IUserResponse {
    id?: string;
    role?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    phone_code?: string; // international code prefix
    city?: string;
    date_of_birth?: Date;
    created_at?: Date;
    general_rating?: number;
    is_available?: boolean;
    address?: string;
    bio?: string;
    photo_url?: string;
}

export class UserDto {
    id?: string;
    email: string;
    full_name: string;
    phone: string;
    phone_code: string;
    date_of_birth: Date;
    city: string;
    address: string;
    role: Role;
    created_at?: Date;
    password_hash?: string;
    salt?: string;
    lat?: string;
    lng?: string;
    general_rating?: number;
    is_available?: boolean;
    bio?: string;
    photo_url?: string;

    constructor(data?: Partial<any>) {
        if (data) {
            const allowedProperties = [
                'id',
                'full_name',
                'email',
                'phone',
                'phone_code',
                'city',
                'address',
                'created_at',
                'date_of_birth',
                'role',
                'password_hash',
                'salt',
                'lat',
                'lng',
                'general_rating',
                'is_available',
                'bio',
                'photo_url',
            ];

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
            full_name: this.full_name,
            city: this.city,
            date_of_birth: this.date_of_birth,
            role: this.role,
            lat: this.lat,
            lng: this.lng,
            phone: this.phone,
            phone_code: this.phone_code,
            email: this.email,
            address: this.address,
            photo_url: this['photo_url'],
        };
        if (this.role === Role.CLEANER) {
            Object.assign(publicInfo, { is_available: this.is_available, general_rating: this.general_rating, bio: this.bio });
        }
        const privateInfo = {
            email: this.email,
            phone: this.phone,
            phone_code: this.phone_code,
            created_at: this.created_at,
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
            full_name: this.full_name,
            city: this.city,
            date_of_birth: this.date_of_birth,
            role: this.role,
            phone: this.phone,
            phone_code: this.phone_code,
            email: this.email,
            address: this.address,
            photo_url: this.photo_url,
        };
        if (this.role === Role.CLEANER) {
            Object.assign(profile, { is_available: this.is_available, general_rating: this.general_rating, bio: this.bio });
        }
        return profile;
    }
}
