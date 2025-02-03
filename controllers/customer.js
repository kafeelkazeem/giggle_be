import Customer from "../models/customer.js"
import Technician from "../models/technician.js"
import { capitalize, haversineDistance } from "../util/helpers.js"
import bcrypt from 'bcryptjs'

//middleware to get list of technician in the category the customer selected base on their selected search range
export const getSelectedProfession = async (req, res) =>{
    const {profession, latitude, longitude} = req.query
    try {
        const customer = await Customer.findById(req.user.id).select('searchRange')
        const searchRange = customer.searchRange 
        const technicians = await Technician.find({profession: capitalize(profession)}).select('profilePicture businessName email profession location.address availability.isAvailable rating.avgRatings location.latitude location.longitude contact.WhatsAppNumber contact.phoneNumber')
        const nearestTechnician = technicians.filter(i => haversineDistance(latitude, longitude, i.location.latitude, i.location.longitude) <= searchRange * 1000) //technicians within search range in km from user's position
        return res.status(200).json({nearestTechnician: nearestTechnician})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'internal server error'})
    }   
}

//middleware to get the location of technicians to display on maps
export const getTechniciansLocation = async (req, res) =>{
    try {
        const techniciansLocation = await Technician.find().select('businessName profession location.latitude location.longitude')
        console.log(techniciansLocation)
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
        console.log(singleTechnician)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'internal server error'})
    }
}

//middleware to search for a technician by name or address
export const Search = async (req, res) =>{
    const { searchQuery } = req.query
    try {
        // Escape special characters in the query string
        const sanitizedQuery = searchQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const technicians = await Technician.find({
             $or: [
              { businessName: { $regex: sanitizedQuery, $options: 'i' } },
              { 'location.address':  { $regex: sanitizedQuery, $options: 'i' } },
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
    const {fullName, phoneNumber} = req.body;
    try {
        await Customer.findByIdAndUpdate(req.user.id, {fullName: fullName, phoneNumber: phoneNumber}, {runValidators: true})
        return res.status(201).json({message: 'Profile updated'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'an error occured'})
    }
}

//middware to update search range
export const updateSearchRange = async (req, res) =>{
    const {searchRange} = req.body
    try {
        await Customer.findByIdAndUpdate(req.user.id, {searchRange: searchRange})
        return res.status(201).json({message: 'Search range updated'})
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