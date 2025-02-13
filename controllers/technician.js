import Technician from "../models/technician.js"
import axios from "axios"
import cloudinary from "../util/cloudinary.js";
import bcrypt from 'bcryptjs'

export const updateTechnicianProfile = async (req, res) =>{
    const {businessName, profession, address, WhatsAppNumber, phoneNumber} = req.body
    let latitude, longitude;
    try {
        // API URL for Google Maps Geocoding API
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

        // Send a GET request to the API
        const response = await axios.get(url);

        // Check the response for errors
        if (response.data.status === "OK" && response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry.location;
            latitude = lat;
            longitude = lng;
        } else {
            console.log(response.data);
            return res.status(404).json({ error: "Location not found" });
         }
        const technician = await Technician.findByIdAndUpdate(req.user.id, {businessName, profession, contact : {phoneNumber, WhatsAppNumber}, location : {address, latitude, longitude}}, {runValidators: true})
        if(!technician){
            return res.status(404).json({message: 'Not found'})
        }
        return res.status(201).json({message: 'Profile updated', latitude, longitude})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'internal server error'})
    }
}

export const uploadProfilePicture = async (req, res) =>{
    cloudinary.uploader.upload(req.file.path, async function (err, result){
        if(err) {
          console.log(err);
          return res.status(500).json({success: false,message: "Error"})
        }
        try {
            const technician = await Technician.findByIdAndUpdate(req.user.id, {profilePicture: result.url })
            if(!technician){
                return res.status(404).json({message: 'Not found'})
            }
            res.status(200).json({ success: true, message:"Uploaded!", url: result.url})
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'internal server error'})
        }
    })
}

export const uploadPastJobsPicture = async (req, res) => {
    cloudinary.uploader.upload(req.file.path, async function (err, result){
        if(err) {
          console.log(err);
          return res.status(500).json({success: false,message: "Error"})
        }
        try {
            // Add the new image URL to the `pastJobsPicture` array
            const technician = await Technician.findByIdAndUpdate(
                req.user.id,
                { $push: { pastJobsPicture: result.url } },
                { new: true } // Return the updated document
            );

            if(!technician){
                return res.status(404).json({message: 'Not found'})
            }
        
            res.status(200).json({
                success: true,
                message: 'Image uploaded successfully!',
                images: technician.pastJobsPicture,
            });
        } catch (error) {
            console.error('Error uploading image:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    })
}

export const deleteImage = async (req, res) =>{
    const { imageUrl } = req.body
    try {
        // Extract the public ID of the image from the URL
        const publicId = imageUrl.split('/').pop().split('.')[0];

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        const technician = await Technician.findByIdAndUpdate(
            req.user.id,
            { $pull: { pastJobsPicture: imageUrl } }, // Remove the specific image URL from the array
            { new: true } // Return the updated document
        );

        if(!technician){
            return res.status(404).json({message: 'Not found'})
        }

        return res.status(200).json({
            success: true,
            message: 'Image deleted successfully.',
            images: technician.pastJobsPicture, // Optional: Return the updated technician
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getMyProfile = async (req, res) =>{
    try {
        const myProfile = await Technician.findById(req.user.id)
        if(!myProfile){
            return res.status(404).json({message: 'Not found'})
        }
        res.status(200).json({myProfile})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'internal server error'})
    }
}

export const updateBio = async (req, res) =>{
    const { bio } = req.body
    try {
        await Technician.findByIdAndUpdate(req.user.id, {bio: bio})
        return res.status(201).json({message: 'updated'})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'internal server error'})
    }
}

export const updateDescription = async (req, res) =>{
    const { desciption } = req.body
    try {
        await Technician.findByIdAndUpdate(req.user.id, {description: desciption})
        return res.status(201).json({message: 'updated'})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'internal server error'})
    }
}

export const getImages = async (req, res) =>{
    try {
        const images = await Technician.findById(req.user.id).select('pastJobsPicture')
        return res.status(200).json({images})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'internal server error'})
    }
}

export const getSocials = async (req, res) =>{
    try {
        const technician = await Technician.findById(req.user.id).select('socialLinks')
        return res.status(200).json({technician})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'internal server error'})
    }
}

export const addSocials = async (req, res) =>{
    const { socialLink } = req.body
    try {
        const technician = await Technician.findByIdAndUpdate(
            req.user.id,
            { $push: { socialLinks: socialLink } },
            { new: true } // Return the updated document
        );
        res.status(201).json({message: 'Link added'})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'internal server error'})
    }
}

export const removeSocials = async (req, res) =>{
    const { socialLink } = req.body
    try {
        const technician = await Technician.findByIdAndUpdate(
            req.user.id,
            { $pull: { socialLinks: socialLink } },
            { new: true } // Return the updated document
        );
        res.status(201).json({message: 'Link removed'})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'internal server error'})
    }
}

//Middleware to change password
export const changePassword = async (req, res) =>{
    const {currentPassword, newPassword} = req.body;
    try {
        const technician = await Technician.findById(req.user.id)
        
        const isCurrentPassword = await bcrypt.compare(currentPassword, technician.password)
        if(!isCurrentPassword){
            return res.status(400).json({message: 'Old password incorrect'})
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await Technician.findByIdAndUpdate(req.user.id, {password: hashedPassword}, {runValidators: true})

        return res.status(201).json({message: 'Password changed succesfully'})

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'an error occured'})
    }
}

export const getAvailaibility = async (req, res) =>{
    try {
        const technician = await Technician.findById(req.user.id).select('availability.isAvailable availability.hours.start availability.hours.end')
        console.log(technician)
        return res.status(200).json(technician)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'an error occured'})
    }
}

export const updateAvailability = async (req, res) =>{
    const { isAvailable, startTime, endTime} = req.body
    try {
        await Technician.findByIdAndUpdate(req.user.id, {'availability.isAvailable': isAvailable, 'availability.hours.start': startTime, 'availability.hours.end': endTime})
        return res.status(200).json({message: 'updated'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'an error occured'})
    }
}