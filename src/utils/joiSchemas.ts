import Joi, {ObjectSchema} from "joi";
import {BookDto} from "../model/BookDto.js";

export const bookDtoSchema:ObjectSchema<BookDto> = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.string().required(),
    quantity: Joi.number().positive().max(100)
})

export const bookIdSchema = Joi.string().length(36).required()

export const readerSchema = Joi.string().required();

export const pickUpBookSchema = Joi.object({
    id:Joi.string().length(36).required(),
    reader: Joi.string().required() //to scale
})