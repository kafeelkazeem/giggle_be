import 'dotenv/config.js';
import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import AuthRoute from './routes/auth.js'
import CustomerRoute from './routes/customer.js'
import TechnicianRoute from './routes/technician.js'

const PORT = process.env.PORT
const DATABASE_URI = process.env.DATABASE_URI

const app = express()

app.use(express.json())

app.use(cors())

app.use('/api', AuthRoute)
app.use('/api', CustomerRoute)
app.use('/api', TechnicianRoute)

mongoose.connect(DATABASE_URI)
.then(res =>{
  console.log('connected')
})
.catch(err => console.log('not connected'))

app.listen(PORT, ()=> console.log('running on port', PORT))