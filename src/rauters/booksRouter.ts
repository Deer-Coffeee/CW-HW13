import express from "express";
import {BookController} from "../controllers/BookController.js";
import asyncHandler from "express-async-handler";
import {Book} from "../model/Book.js";
import {bookDtoSchema, bookIdSchema, readerSchema} from "../utils/joiSchemas.js";
import {BookDto} from "../model/BookDto.js";
import {getGenre} from "../utils/tools.js";

export const booksRouter = express.Router();

const controller = new BookController();

booksRouter.get('/', asyncHandler(async (req, res) => {
    const result: Book[] = await controller.getAllBooks();
    res.type("application/json").json(result)
}));

booksRouter.post('/',asyncHandler(async (req, res) => {
    const dto = req.body;
    const {error} = bookDtoSchema.validate(dto);
    if (error) throw new Error(JSON.stringify({status: 400, message: error.message}));
    const result: Book = await controller.addBook(dto as BookDto);
    res.type("application/json").json(result);
}));

booksRouter.delete('/',asyncHandler(async (req, res) => {
    const id = req.query.id;
    const {error} = bookIdSchema.validate(id);
    if (error) throw new Error(JSON.stringify({status: 400, message: error.message}));
    const result: BookDto = await controller.removeBook(id as string);
    res.type("application/json").json(result);
}))
booksRouter.put('/pickup', asyncHandler(async (req, res) => {
    const id = req.query.id;
    let {error} = bookIdSchema.validate(id);
    if (error) throw new Error(JSON.stringify({status: 400, message: error.message}));

    await controller.pickUpBook(id as string);
    res.send('Book picked up')
}));

booksRouter.put('/return', asyncHandler(async (req, res) => {
    const id = req.query.id;
    let {error} = bookIdSchema.validate(id);
    if (error) throw new Error(JSON.stringify({status: 400, message: error.message}));
    const {reader} = req.body;
    error = readerSchema.validate(reader).error;
    if (error) throw new Error(JSON.stringify({status: 400, message: error.message}));
    await controller.returnBook(id as string, reader as string);
    res.send('Book returned')
}));

booksRouter.get('/genre', asyncHandler(async (req, res) => {
    const result: BookDto[] = await controller.getBooksByGenre(req.query.genre as string);
    res.type("application/json").json(result)
}))

booksRouter.get('/genre/status', asyncHandler(async (req, res) => {
    const {genre, status} = req.query;
    const result: Book[] = await controller.getBooksByGenreAndStatus(genre as string, status as string);
    res.type("application/json").json(result)
}))