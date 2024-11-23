import mongoose from "mongoose";



const airportSchema = new mongoose.Schema({
    code: {
        type: String, unique: true, required: true
    },
    name: String,
    city: String,
    country: String
});

const bookingSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    flight_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flight"
    },
    booking_date: {
        type: Date,
    },
    tolal_price: {
        type: Number
    },
    status: {
        type: String
    },
    emailVerified: {
        type: Boolean
    },
    verificationToken: {
        type: String
    },
})

const flightsSchema = new mongoose.Schema({
    flight_number: {
        type: String,
        required: true,
    },
    departure_airport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Airport'
    },
    arrival_airport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Airport'
    },
    departure_date: {
        type: Date
    },
    arrival_date: {
        type: Date
    },
    flight_duration: {
        type: Number
    },
    price: {
        type: Number
    },
    available_seats: {
        type: Number
    }
})

const passengerSchema = new mongoose.Schema({
    booking_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Booking'
    },
    name: String,
    age_category: {
        type: [String]
    }
});

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: "admin"
    }
})

const paymentSchema = new mongoose.Schema({
    booking_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Booking'
    },
    payment_date: Date,
    amount: Number,
    payment_method: String,
    status: String
});

let Airport = mongoose.model("Airport", airportSchema)
let Booking = mongoose.model("Booking", bookingSchema)
let Flight = mongoose.model("Flight", flightsSchema)
let Passenger = mongoose.model('Passenger', passengerSchema);
let Payment = mongoose.model('Payment', paymentSchema);
let User = mongoose.model("User", userSchema)

module.exports = {
    Airport,
    Booking,
    Flight,
    Passenger,
    Payment,
    User
}