import {LibraryServiceImplEmbedded} from "../service/LibraryServiceImplEmbedded.js";
import {LibraryService} from "../service/LibraryService.js";
import {BookDto} from "../model/BookDto.js";
import {Book} from "../model/Book.js";
import {convertBookDtoToBook, convertBookToBookDto, getGenre, getStatus} from "../utils/tools.js";
import {LibraryServiceImplMongo} from "../service/LibraryServiceImplMongo.js";
import {LibraryServiceImplSQL} from "../service/LibraryServiceImplSQL.js";

export class BookController {
    // private libService:LibraryService = new LibraryServiceImplEmbedded();
    // private libService:LibraryService = new LibraryServiceImplMongo();
    private libService:LibraryService = new LibraryServiceImplSQL();

    async getAllBooks() {
        return this.libService.getAllBooks();
    }
    async addBook(dto: BookDto) {
        const book: Book = convertBookDtoToBook(dto);
        const result = await this.libService.addBook(book)
        if (result) {
            console.log(book)
            return book;
        }
        throw new Error(JSON.stringify({status: 403, message: `Book with id ${book.id} not added`}))
    }

    async removeBook(id: string) {
        const book = await this.libService.removeBook(id);
        return convertBookToBookDto(book);
    }

    async pickUpBook(id: string) {
        await this.libService.pickUpBook(id)
    }

    async returnBook(id: string, reader: string) {
        await this.libService.returnBook(id, reader)
    }

    async getBooksByGenre(genre: string) {
        const gen = getGenre(genre);
        const filteredBooks = await this.libService.getBooksByGenre(gen)
        return filteredBooks.map(book => convertBookToBookDto(book));
    }

    async getBooksByGenreAndStatus(genre: string, status: string):Promise<Book[]> {
        const gen = getGenre(genre);
        const st = getStatus(status);
        return await this.libService.getBooksByGenreAndStatus(gen, st);
    }
}