import dotenv from "dotenv"

dotenv.config({
    path: "./src/.env"
})

export const configENV = {
    MONGO_URL: process.env.MONGO_URL,
    SECRET_CODERH_PASS: process.env.SECRET_CODERH_PASS,
    PORT: process.env.PORT
}