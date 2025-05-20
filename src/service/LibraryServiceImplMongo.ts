import {LibraryService} from "./LibraryService.js";
import {Book, BookGenres, BookStatus} from "../model/Book.js";
import {Error, Schema} from "mongoose";
import {BookModel} from "../model/BookMongo.js";


export class LibraryServiceImplMongo implements LibraryService{
    async addBook(book: Book): Promise<boolean> {
        const isExists = await BookModel.findOne({id: book.id})
        if(isExists) return Promise.resolve(false);
        const bookDoc = new BookModel(book);
        await bookDoc.save();
        return true;
    }

    async getAllBooks(): Promise<Book[]> {
        return Promise.resolve( await BookModel.find({}));
    }

   async getBooksByGenre(genre: BookGenres): Promise<Book[]> {
        return Promise.resolve(await BookModel.find({genre}));
    }

    async pickUpBook(id: string): Promise<void> {
        const book = await BookModel.findOne({id});
        if(!book) throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))
        if(book.status !== BookStatus.ON_STOCK)
            throw new Error(JSON.stringify({status:403, message: `Book with id ${id} is removed or already on hand`}))
        book.status = BookStatus.ON_HAND
        book.save();
    }

    async removeBook(id: string): Promise<Book> {
        const book = await BookModel.findOneAndDelete({id});
        if(!book) throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))
        return book as Book
    }

    async returnBook(id: string, reader: string): Promise<void> {
        const book = await BookModel.findOne({id});
        if(!book)
            throw new Error(JSON.stringify({status:404, message:`Book with id ${id} not found`}))
        if(book.status !== BookStatus.ON_HAND)
            throw new Error(JSON.stringify({status:403, message: `Book with id ${id} is on stock or removed. Check your book ID`}))
        book.status = BookStatus.ON_STOCK;
        book.pickList.push({reader, date: new Date().toDateString()})
        book.save();
    }

    async getBooksByGenreAndStatus(gen: string, st: string): Promise<Book[]> {
        return BookModel.find({genre: gen, status: st})
    }

}