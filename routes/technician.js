import express from 'express'
import { getSelectedCategory } from '../controllers/technician.js'

const router = express.Router()

router.get('/getSelectedCategory', getSelectedCategory)

export default router