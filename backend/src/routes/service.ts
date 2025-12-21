import { Router } from 'express';
import { createRequest, getNearbyRequests, acceptRequest, getMyRequests } from '../controllers/serviceController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, authorize(['customer']), createRequest);
router.get('/nearby', authenticate, authorize(['vendor']), getNearbyRequests);
router.get('/my', authenticate, getMyRequests);
router.put('/:requestId/accept', authenticate, authorize(['vendor']), acceptRequest);

export default router;
