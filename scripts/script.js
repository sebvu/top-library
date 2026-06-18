// book object instantiation
function Book(author, title, pages, cover) {
  if (!new.target) {
    throw Error("Book object not initialized with new keyword");
  }
  this.author = author;
  this.title = title;
  this.pages = pages;
  this.hasRead = false;
  this.cover = cover;
  // metadata
  this.id = crypto.randomUUID();
}

Book.prototype.toggleRead = function () {
  this.hasRead = hasRead ? false : true;
};

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

function main() {
  // keywords
  const THEME_REF_NAME = "data-theme";

  const root = document.documentElement;
  const themeButton = document.querySelector(".header__toggle-button");
  const cardsCtr = document.querySelector(".main-content");
  const library = new Library();

  // set previously saved theme
  const setSavedTheme = () => {
    const savedTheme = localStorage.getItem(THEME_REF_NAME);

    if (localStorage.getItem(THEME_REF_NAME))
      root.setAttribute(THEME_REF_NAME, savedTheme);
  };

  setSavedTheme();

  // theme switcher handler
  themeButton.addEventListener("click", () => {
    const currTheme = root.getAttribute(THEME_REF_NAME);

    let newTheme = currTheme.toLowerCase() === "light" ? "dark" : "light";

    root.setAttribute(THEME_REF_NAME, newTheme);

    localStorage.setItem(THEME_REF_NAME, newTheme); // persist theme per session
  });
}

main();
