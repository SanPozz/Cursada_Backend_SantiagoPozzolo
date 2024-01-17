import mongoose from 'mongoose';

const dbConnect = () => {
    mongoose.connect('mongodb+srv://pozzolosanti:n76CiNr4u21GNSKJ@cluster0.adq0f1x.mongodb.net/?retryWrites=true&w=majority')
        .then(() => console.log('Database connected'))
        .catch((err) => console.log(err));
}

export default dbConnect