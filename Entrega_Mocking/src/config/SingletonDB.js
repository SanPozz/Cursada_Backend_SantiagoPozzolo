import mongoose from 'mongoose';

export class SingletonDB{
    static #instance
    constructor(url){
        mongoose.connect(url)
    }

    static connectDB(url){
        if(this.#instance){
            console.log(`Database already connected`)
            return this.#instance
        }
        this.#instance=new SingletonDB(url)
        console.log(`Database Connected!`)
        return this.#instance

    }
}

