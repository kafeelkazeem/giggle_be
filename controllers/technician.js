import Technician from "../models/technician.js"
import { haversineDistance } from "../util/helpers.js"

//middleware to get list of technician in the category the customer selected
export const getSelectedCategory = async (req, res) =>{
    const {category, latitude, longitude} = req.query
    try {
        const technicians = await Technician.find({category: category.toLowerCase()}).select('businessName category address ratings latitude longitude')
        const nearestTechnician = technicians.filter(i => haversineDistance(latitude, longitude, i.latitude, i.longitude) <= 10000) //technicians within 10km from user's position
        return res.status(200).json({nearestTechnician: nearestTechnician})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'internal server error'})
    }   
}