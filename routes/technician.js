import express from 'express'
import { getSelectedCategory } from '../controllers/technician.js'
import { query } from 'express-validator'
import { checkValidation } from '../middlewares/checkValidation.js'

const router = express.Router()

const selectedCategoryVal = [
    query('category').trim().toLowerCase().notEmpty(),
    query('latitude').trim().isNumeric().notEmpty(),
    query('longitude').trim().isNumeric().notEmpty()
]

router.get('/getSelectedCategory', selectedCategoryVal, checkValidation, getSelectedCategory)

export default router