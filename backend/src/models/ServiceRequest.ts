import mongoose, { Schema, type Document } from 'mongoose';


export enum RequestStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export interface IServiceRequest extends Document {
    customer: mongoose.Types.ObjectId;
    vendor?: mongoose.Types.ObjectId;
    location: {
        address: string;
        coordinates: [number, number];
    };
    vehicleInfo: {
        make: string;
        model: string;
        regNumber: string;
    };
    description?: string;
    status: RequestStatus;
    createdAt: Date;
}

const ServiceRequestSchema: Schema = new Schema({
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'User' },
    location: {
        address: { type: String, required: true },
        coordinates: { type: [Number], index: '2dsphere', required: true }
    },
    vehicleInfo: {
        make: String,
        model: String,
        regNumber: String
    },
    description: String,
    status: { type: String, enum: Object.values(RequestStatus), default: RequestStatus.PENDING },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IServiceRequest>('ServiceRequest', ServiceRequestSchema);
