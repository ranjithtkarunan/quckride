import mongoose, { Schema, type Document } from 'mongoose';


export enum UserRole {
    CUSTOMER = 'customer',
    VENDOR = 'vendor'
}

export interface IUser {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    phone: string;
    secondaryPhone?: string;
    address?: string;
    profileImage?: string;
    bio?: string;
    vehicles?: {
        make: string;
        model: string;
        regNumber: string;
        color?: string;
        year?: number;
    }[];
    vendorDetails?: {
        shopName: string;
        baseLocation: {
            type: string;
            coordinates: [number, number];
        };
        isAvailable: boolean;
        services: string[];
        experienceYears?: number;
        businessHours?: string;
        rating: number;
    };
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    phone: { type: String, required: true },
    secondaryPhone: String,
    address: String,
    profileImage: String,
    bio: String,
    vehicles: [{
        make: String,
        model: String,
        regNumber: String,
        color: String,
        year: Number
    }],
    vendorDetails: {
        shopName: String,
        baseLocation: {
            type: { type: String, default: 'Point' },
            coordinates: { type: [Number], index: '2dsphere' }
        },
        isAvailable: { type: Boolean, default: true },
        services: [String],
        experienceYears: Number,
        businessHours: String,
        rating: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
