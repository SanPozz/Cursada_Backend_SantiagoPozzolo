import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
    code: {
        type: String, // generatedcode
        unique: true
    },
    purchase_datetime: {
        type: Date //datetime
    },
    amount: {
        type: Number //total
    },
    purchaser: {
        type: String //email
    }

})

const Ticket = model('tickets', ticketSchema);
export default Ticket