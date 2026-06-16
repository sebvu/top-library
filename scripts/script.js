// book object instantiation
function Book(author, title, pages) {
  if (!new.target) {
    throw Error("Book object not initialized with new keyword");
  }
  this.author = author;
  this.title = title;
  this.pages = pages;
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

// visibly display book
function constructBooks(ctr, library) {
  const newBook = document.createElement("div");

  for (let i = 0; i < library.books.length; i++) {
    newBook.className = "bookContainer";
    const author = document.createElement("p");
    author.textContent = library.books[i].author;
    const title = document.createElement("p");
    title.textContent = library.books[i].title;
    const pages = document.createElement("p");
    pages.textContent = library.books[i].pages;

    newBook.appendChild(author);
    newBook.appendChild(title);
    newBook.appendChild(pages);
  }

  ctr.appendChild(newBook);
}

function main() {
  const ctr = document.querySelector(".container");
  const library = new Library();

  library.addBook("andy weir", "hail mary", 496);
  library.addBook("jester santosx", "goodbye", 2);
  library.addBook("other books", "fdf", 242);
  library.addBook("lala", "ladedall", 24264);

  console.log(library.books);

  constructBooks(ctr, library);
}

main();
