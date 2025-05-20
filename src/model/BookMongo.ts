import mongoose from "mongoose";
import {BookGenres, BookStatus} from "./Book.js";


const BookMongoSchema = new mongoose.Schema({
    id: {type: String, required: true},
    title: {type: String, required: true},
    author: {type: String, required: true},
    genre: {type: String, enum: BookGenres, required: true},
    status: {type: String, enum: BookStatus, required: true},
    pickList: {type:[{reader:{type:String}, date:{type:String}}]}
})

export const BookModel=
    mongoose.model('Book', BookMongoSchema, 'books_collection')