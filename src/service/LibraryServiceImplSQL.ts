import {LibraryService} from "./LibraryService.js";

import {Book, BookGenres, BookStatus} from "../model/Book.js";

import {pool} from "../config/libConfig.js";

export class LibraryServiceImplSQL implements LibraryService{

async addBook(book: Book): Promise<boolean>{

const [rows] = await pool.query('SELECT * FROM books WHERE id = ?',[book.id]);

if ((rows as any[]).length > 0) return false;

await pool.query('INSERT INTO books (id, title, author, genre, status) VALUES (?, ?, ?, ?, ?)',[

book.id,
book.title,
book.author,
book.genre,
book.status

]);

return true;
}
async getAllBooks(): Promise<Book[]>{

const [rows] = await pool.query
('SELECT * FROM books');

return rows as Book[];
}

async getBooksByGenre(genre: BookGenres): Promise<Book[]>{

const [rows] = await pool.query
('SELECT * FROM books WHERE genre = ?',[genre]);

return rows as Book[];

}

async getBooksByGenreAndStatus(gen:string, st:string): Promise<Book[]>{

const [rows] = await pool.query
('SELECT * FROM books WHERE genre = ? AND status = ?',[gen,st]);

return rows as Book[];

}

async pickUpBook(id:string): Promise<void>{

const [rows] = await pool.query
('SELECT * FROM books WHERE id = ?',[id]);

const books = rows as Book[];

if (books.length === 0){

throw new Error(JSON.stringify({status: 404, message:
`Book with id ${id} not found`}));

}

const book = books[0];

if(book.status !== BookStatus.ON_STOCK){

throw new Error(JSON.stringify({status: 403, message:
`Book with id ${id} is removed or already on hand`}));

}

await pool.query
('UPDATE books SET status = ? WHERE id = ?',
[BookStatus.ON_HAND, id]);

}

async removeBook(id:string): Promise<Book>{

const [rows] = await pool.query
('SELECT * FROM books WHERE id = ?', [id]);

const books = rows as Book[];

if(books.length === 0){

throw new Error(JSON.stringify({status: 404, message:
`Book with id ${id} not found`}));

}

const removedBook = books[0];

await pool.query
('UPDATE books SET status = ? WHERE id = ?', [BookStatus.REMOVED, id]);

return removedBook;

}

async returnBook(id:string, reader:string): Promise<void>{

const [rows] = await pool.query
('SELECT * FROM books WHERE id = ?', [id]);

const books = rows as Book[];

if(books.length === 0){

throw new Error(JSON.stringify({status: 404, message:
`Book with id ${id} not found`}));

}

const book = books[0];

if(book.status !== BookStatus.ON_HAND){

throw new Error(JSON.stringify({status: 403, message:
`Book with id ${id} is on stock or removed. Check your book ID`}));

}

let readerId: number;
const [readerRows] = await pool.query
('SELECT * FROM readers WHERE name = ?',[reader]);

if((readerRows as any[]).length === 0){

const result = await pool.query
('INSERT INTO readers (name) VALUES (?)', [reader]);

readerId = (result as any).insertId;

}else{

readerId = (readerRows as any)[0].id;

}

await pool.query
('UPDATE books SET status = ? WHERE id = ?',[BookStatus.ON_STOCK,id]);

await pool.query(
'INSERT INTO books_readers(book_id, reader_id, date)VALUES (?, ?, ?)',

[id, readerId, new Date().toDateString()]

);
}
}
