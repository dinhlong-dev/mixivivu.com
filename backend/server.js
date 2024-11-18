import express from 'express'
require('dotenv').config()
import cors from 'cors'
import initRoutes from './src/routes'
import { connectDB } from './src/config/connectDB'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import mongoose from 'mongoose'
const airportRoute = require("./src/routes/airport")
const flightRoute = require("./src/routes/flights")
// const bookingRoute = require("./src/routes/booking")


const app = express()

// CONNECT DB
async function connectToMongo() {
    try {
        await mongoose.connect((process.env.MONGODB_URL), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("connected to mongoDB")
    } catch (e) {
        console.log("connect to mongoDB error", e)
    }
}

connectToMongo()

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", 'GET', 'PUST', "DELETE"]
}))

app.use(bodyParser.json({ limit: "50mb" }))
app.use(morgan("common"))

// ROUTES
app.use("/v1/airport", airportRoute);
// app.use("/v1/booking", bookingRoute);
app.use("/v1/flight", flightRoute);

app.use(express.json())
app.use(express.urlencoded({ extends: true }))

initRoutes(app)

const port = process.env.PORT || 8888
const listener = app.listen(port, () => {
    console.log(`Server is running on the port ${listener.address().port}`)
})