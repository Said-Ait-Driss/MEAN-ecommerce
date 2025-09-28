export interface User {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    phoneCode: string;
    dateOfBirth?: string;
    role: 'USER' | 'CLEANER';
    createdAt: Date;
    updatedAt: Date;
}
