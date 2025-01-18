import Technician from "../models/technician.js"
import axios from "axios"
import cloudinary from "../util/cloudinary.js";

export const updateTechnicianProfile = async (req, res) =>{
    const {businessName, profession, address} = req.body
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
        await Technician.findByIdAndUpdate(req.user.id, {businessName, profession, location : {address, latitude, longitude}}, {runValidators: true})
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
            res.status(200).json({ success: true, message:"Uploaded!", url: result.url})
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'internal server error'})
        }
    })
}

export const getMyProfile = async (req, res) =>{
    try {
        const myProfile = await Technician.findById(req.user.id)
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