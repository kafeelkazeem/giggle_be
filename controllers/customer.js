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

//middleware to get the location of technicians base on the category selected
export const getTechniciansLocation = async (req, res) =>{
    const { selectedCategory } = req.query
    try {
        let techniciansLocation;
        if(selectedCategory === 'all'){
            techniciansLocation = await Technician.find().select('businessName category latitude longitude')
        }else{
            techniciansLocation = await Technician.find({category: selectedCategory}).select('businessName category latitude longitude')
        }
        return res.status(200).json({techniciansLocation: techniciansLocation})        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'internal server error'})
    } 
}

//middleware to get a technician's profile
export const getSingleTechnician = async (req, res) =>{
    const { id } = req.query
    try {
        const singleTechnician = await Technician.findById({id})
        res.status(200).json({singleTechnician: singleTechnician})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'internal server error'})
    }
}