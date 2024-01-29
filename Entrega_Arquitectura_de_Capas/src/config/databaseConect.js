import mongoose from 'mongoose';

import { configENV } from './configDotEnv.js';


const dbConnect = () => {
    mongoose.connect(configENV.MONGO_URL)
        .then(() => console.log('Database connected'))
        .catch((err) => console.log(err));
}

export default dbConnect