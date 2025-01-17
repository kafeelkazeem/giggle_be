import Technician from "../models/technician.js"
import axios from "axios"

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