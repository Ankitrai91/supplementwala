import express from 'express'
import * as menuController from '../controllers/menuController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/structure', menuController.getMenuStructure)
router.get('/mega-menu', menuController.getMegaMenu)
router.get('/featured', menuController.getFeaturedItems)

// Admin routes
router.post('/', protect, authorize('admin'), menuController.createMenuItem)
router.put('/:id', protect, authorize('admin'), menuController.updateMenuItem)
router.delete('/:id', protect, authorize('admin'), menuController.deleteMenuItem)
router.post('/reorder', protect, authorize('admin'), menuController.reorderMenuItems)

export default router
