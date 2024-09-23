import Customer from "../models/customer.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Technician from "../models/technician.js"
import axios from "axios"

const jwtSecret = process.env.JWTSECRET
const geoCoding_ApiKey = process.env.OPENCAGE_GEOCODING_API_KEY

//middleware for registering new customer
export const registerCustomer = async (req, res) =>{
  
    //retrieve the new customer credential from the request body
    const {fullName, email, phoneNumber, location, password} = req.body
    try {

        // check if account exist
        const emailExist = await Customer.findOne({email: email})
        if(emailExist){
          return res.status(401).json({error: 'Account already exist'})
        }

        //encrypt the password before storing in the database
         const hashedPassword = await bcrypt.hash(password, 10)

        //store the new customer's credential in the databse
         const newCustomer = await Customer.create({fullName: fullName, email: email, phoneNumber: phoneNumber, password: hashedPassword})

         //save the data
         await newCustomer.save()
         
         console.log('account created')
         return res.status(201).json({success: 'New customer created'})

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'internal server error'})
    }
}

//middleware for registering new technician
export const registerTechnician = async (req, res) =>{
  const {businessName, category, email, phoneNumber, address, state, password} = req.body
  let latitude, longitude
  try {

    //check if account exist
    const emailExist = await Technician.findOne({email: email})
    if(emailExist){
      return res.status(401).json({error: 'Account already exist'})
    }    

    //encrypt the password before storing in the database
    const hashedPassword = await bcrypt.hash(password, 10)

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${geoCoding_ApiKey}`;

    const response = await axios.get(url)
   
    if (response.data.status.code === 200 && response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      latitude = lat;
      longitude = lng;
    } else {
      return res.status(404).json({ error: 'Location not found' });
    }

    //store the new customer's credential in the databse
    const newTechnician = await Technician.create({businessName: businessName, category: category, email: email, phoneNumber: phoneNumber, address: address, latitude: latitude, longitude: longitude, password: hashedPassword})

    //save the data
    await newTechnician.save()
    
    console.log('account created')
    return res.status(201).json({success: 'New technician created'})

  } catch (error) {
    console.log(error)
    return res.status(500).json({error: 'internal server error'})
  }
}

//middleware for customer login
export const customerLogin = async (req, res) =>{

   // retrieve the login credential from the request body
   const {email, password} = req.body

   try {
       // checks if the email entered exists in the database
       const customer = await Customer.findOne({email: email})
       if(!customer){
         return res.status(404).json({error: 'Invalid email or password'}) 
       }

       //checks if the password matches
       const isPassword = await bcrypt.compare(password, customer.password)
       if(!isPassword){
        return res.status(404).json({error: 'Invalid email or password'})
       }

       //assign a json web token to the customer
       const token = jwt.sign({id: customer._id, email: customer.email}, jwtSecret, {expiresIn: '4h'} )

       return res.status(200).json({success: 'Logged in successfully', token: token, customer: customer})

   } catch (error) {
     console.log(error)
     return res.status(500).json({error: 'interal server error'})
   }      
}

//middleware for technician login
export const technicianLogin = async (req, res) =>{

  // retrieve the login credential from the request body
  const {email, password} = req.body

  try {
      // checks if the email entered exists in the database
      const technician = await Technician.findOne({email: email})
      if(!technician){
        return res.status(404).json({error: 'Invalid email or password'}) 
      }

      //checks if the password matches
      const isPassword = await bcrypt.compare(password, technician.password)
      if(!isPassword){
       return res.status(404).json({error: 'Invalid email or password'})
      }

      //assign a json web token to the customer
      const token = jwt.sign({id: technician._id, email: technician.email}, jwtSecret, {expiresIn: '4h'} )

      return res.status(200).json({success: 'Logged in successfully', token: token, user: technician})

  } catch (error) {
    console.log(error)
    return res.status(500).json({error: 'interal server error'})
  }      
}