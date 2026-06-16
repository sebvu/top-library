// book object instantiation
function Book(author, title, pages, cover) {
  if (!new.target) {
    throw Error("Book object not initialized with new keyword");
  }
  this.author = author;
  this.title = title;
  this.pages = pages;
  this.cover = cover;
  // metadata
  this.id = crypto.randomUUID();
}

// central library object to handle all library logic
function Library() {
  if (!new.target) {
    throw Error("Library object not initialized with new keyword");
  }
  this.books = []; // stores Book objects
}

// add new book object to books array
Library.prototype.addBook = function (author, title, pages) {
  this.books.push(new Book(author, title, pages));
};

// search book by id and delete from array if found
Library.prototype.deleteBook = function (id) {
  if (typeof id !== "string")
    throw Error(`deleteBook ID type is not string: ${id}`);

  let index = null;
  this.books.find((book, i) => {
    if (book.id === id) {
      index = i;
      return true;
    }
    return false;
  });

  if (index !== null) {
    console.log(`Deleting ${this.books[index].title}`);
    this.books = this.books.slice(0, index).concat(this.books.slice(index + 1));
  } else {
    throw Error(`Could not delete book with ID ${id}`);
  }
};

// display current books in library
function constructBooks(ctr, library) {
  for (let i = 0; i < library.books.length; i++) {
    const newBook = document.createElement("div");
    const author = document.createElement("p");
    const title = document.createElement("p");
    const pages = document.createElement("p");
    // const image = document.createElement("img");

    /* logic */

    newBook.appendChild(pages);

    ctr.appendChild(newBook);
  }
}

function main() {
  const ctr = document.querySelector(".container");
  const library = new Library();

  constructBooks(ctr, library);
}

main();
