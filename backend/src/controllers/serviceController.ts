import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import ServiceRequest, { RequestStatus } from '../models/ServiceRequest.js';

export const createRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { location, vehicleInfo, description } = req.body;
        const customerId = req.user?.id;

        const newRequest = new ServiceRequest({
            customer: customerId,
            location,
            vehicleInfo,
            description,
        });

        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getNearbyRequests = async (req: AuthRequest, res: Response) => {
    try {
        // For simplicity, returning all pending requests. In production, use GeoJSON proximity.
        const requests = await ServiceRequest.find({ status: RequestStatus.PENDING })
            .populate('customer', 'name phone')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const acceptRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { requestId } = req.params;
        const vendorId = req.user?.id;

        const request = await ServiceRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.status !== RequestStatus.PENDING) {
            return res.status(400).json({ message: 'Request already handled' });
        }

        request.vendor = vendorId as any;
        request.status = RequestStatus.ACCEPTED;
        await request.save();

        res.json(request);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMyRequests = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;

        const query = role === 'customer' ? { customer: userId } : { vendor: userId };
        const requests = await ServiceRequest.find(query).sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
