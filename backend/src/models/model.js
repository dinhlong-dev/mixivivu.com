import mongoose from "mongoose";



const airportSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

const airlinesSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    }
});

const bookingSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    flight_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flight"
    },
    booking_date: {
        type: Date,
    },
    total_price: {
        type: Number
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled']
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
        unique: true
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
        type: Date,
        required: true
    },
    arrival_date: {
        type: Date,
        required: true
    },
    flight_duration: {
        type: Number
    },
    price_adult: {
        type: Number,
        required: true
    },
    price_child: {
        type: Number,
        required: true
    },
    price_infant: {
        type: Number,
        required: true
    },
    available_seats: {
        type: Number,
        default: 0
    },
    airline: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AirLine',
        required: true
    },
    seat_class: {
        type: String,
        enum: ['Economy', 'Business', 'First'],
        required: true
    },
    carry_on_baggage: {
        type: String
    },
    checked_baggage: {
        type: String
    },
})

const passengerSchema = new mongoose.Schema({
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    name: String,
    age_category: {
        type: String,
        enum: ['Người lớn', 'Trẻ em', 'Em bé'],
        required: true
    },
    price: {
        type: Number,
        required: true
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
    status: {
        type: String,
        emun: ['pending', 'completed', 'failed']
    }
});

let Airport = mongoose.model("Airport", airportSchema)
let Booking = mongoose.model("Booking", bookingSchema)
let Flight = mongoose.model("Flight", flightsSchema)
let Passenger = mongoose.model('Passenger', passengerSchema);
let Payment = mongoose.model('Payment', paymentSchema);
let User = mongoose.model("User", userSchema)
let AirLine = mongoose.model("AirLine", airlinesSchema)

module.exports = {
    Airport,
    Booking,
    Flight,
    Passenger,
    Payment,
    User,
    AirLine
}