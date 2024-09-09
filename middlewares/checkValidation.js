import { validationResult } from "express-validator"

export const checkValidation = (req, res, next) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(401).json({error: error.array()})
    }
    next()
}