import express from "express";
import {booksRouter} from "./booksRouter.js";


export const libRouter = express.Router();
libRouter.use('/books', booksRouter)
