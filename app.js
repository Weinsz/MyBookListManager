// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handles UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(element) {
        if(element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    }

    // Build this using the DOM -> Ex. <div class="alert alert-success">Whatever</div>
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish in 5 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 5000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';

    }
}

// Store Class: Handles (Local) Storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn == isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevents actual submit
    e.preventDefault();
    
    // Gets form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Hey, you have to fill in all fields', 'danger');
    } else {
    // Instantiate Book
        const book = new Book(title, author, isbn);
        
        // Add Book to UI
        UI.addBookToList(book);

        // Add Book to Local Store
        Store.addBook(book);

        // Success message
        UI.showAlert('Book Added', 'success');

        // Clear Fields
        UI.clearFields();
    } 
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remove Book from UI
    UI.deleteBook(e.target);

    // Remove Book from Local Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Success message
    UI.showAlert('Book Removed', 'success');
});