import Customer from "../models/customer.js"
import Technician from "../models/technician.js"
import { haversineDistance } from "../util/helpers.js"
import bcrypt from 'bcryptjs'

//middleware to get list of technician in the category the customer selected
export const getSelectedCategory = async (req, res) =>{
    const {category, latitude, longitude} = req.query
    try {
        const technicians = await Technician.find({category: category.toLowerCase()}).select('businessName category address avgRatings latitude longitude')
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
    const { technicianId } = req.query
    try {
        const singleTechnician = await Technician.findOne({_id: technicianId})
        res.status(200).json({singleTechnician: singleTechnician})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'internal server error'})
    }
}

//middleware to search for a technician
export const Search = async (req, res) =>{
    const { searchQuery } = req.query
    try {
        // Escape special characters in the query string
        const sanitizedQuery = searchQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const technicians = await Technician.find({
             $or: [
              { businessName: { $regex: sanitizedQuery, $options: 'i' } },
              { address: { $regex: sanitizedQuery, $options: 'i' } },
            ],
        });
        res.status(200).json({technicians: technicians});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'internal server error'})
    }
}

//Middleware to update profile
export const updateProfile = async (req, res) =>{
    console.log('recieved')
    const {fullName, phoneNumber} = req.body;
    try {
        await Customer.findByIdAndUpdate(req.user.id, {fullName: fullName, phoneNumber: phoneNumber}, {runValidators: true})

        return res.status(201).json({message: 'Profile updated'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'an error occured'})
    }
}

//Middleware to change password
export const changePassword = async (req, res) =>{
    const {currentPassword, newPassword} = req.body;
    try {
        const customer = await Customer.findById(req.user.id)
        
        const isCurrentPassword = await bcrypt.compare(currentPassword, customer.password)
        if(!isCurrentPassword){
            return res.status(400).json({message: 'Old password incorrect'})
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await Customer.findByIdAndUpdate(req.user.id, {password: hashedPassword}, {runValidators: true})

        return res.status(201).json({message: 'Password changed succesfully'})

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'an error occured'})
    }
}