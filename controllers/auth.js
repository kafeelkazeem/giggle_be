import Customer from "../models/customer.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWTSECRET

//middleware for registering new customer
export const registerCustomer = async (req, res) =>{

    //retrieve the new customer credential from the request body
    const {fullName, email, phoneNumber, location, password} = req.body
    try {
        //encrypt the password before storing in the database
         const hashedPassword = await bcrypt.hash(password, 10)

        //store the new customer's credential in the databse
         const newCustomer = await Customer.create({fullName: fullName, email: email, phoneNumber: phoneNumber, location: location, password: hashedPassword})

         //save the data
         await newCustomer.save()

         return res.status(201).json({success: 'New customer created'})

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

       return res.status(200).json({success: 'Logged in successfully', token: token})

   } catch (error) {
     console.log(error)
     return res.status(500).json({error: 'interal server error'})
   }      
}