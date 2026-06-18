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
  this.hasRead = this.hasRead ? false : true;
};

// central library object to handle all library logic
function Library() {
  if (!new.target) {
    throw Error("Library object not initialized with new keyword");
  }
  this.books = []; // stores Book objects
}

// add new book object to books array
Library.prototype.addBook = function (author, title, pages, cover) {
  this.books.push(new Book(author, title, pages, cover));
};

Library.prototype.findBookIndex = function (id) {
  if (typeof id !== "string")
    throw Error(`findBook ID type is not string: ${id}`);

  let index = null;
  this.books.find((book, i) => {
    if (book.id === id) {
      index = i;
      return true;
    }
    return false;
  });

  return index;
};

// search book by id and delete from array if found
Library.prototype.deleteBook = function (id) {
  const index = this.findBookIndex(id);

  if (index !== null) {
    console.log(`Deleting ${this.books[index].title}`);
    this.books = this.books.slice(0, index).concat(this.books.slice(index + 1));
  } else {
    throw Error(`Could not delete book with ID ${id}`);
  }
};

// display current books in library
function buildExistingBooks(books, ctr) {
  const setAttrs = (el, attrs) => {
    for (let key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  };

  for (var b of books) {
    // construct shell
    const cardFlexContainer = document.createElement("div");
    cardFlexContainer.classList.add(...["card-flex-container"]);
    const card = document.createElement("div");
    card.classList.add(...["card"]);
    card.setAttribute("id", b.id);
    cardFlexContainer.appendChild(card);

    // determine read status
    if (b.hasRead) {
      cardFlexContainer.classList.add(...["card--read"]);
    } else {
      cardFlexContainer.classList.add(...["card--not-read"]);
    }

    // top level elements

    // card bookmark icon
    const cardBookmarkIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    cardBookmarkIcon.classList.add(...["card__bookmark-icon"]);
    setAttrs(cardBookmarkIcon, {
      viewBox: "0 0 24 24",
    });
    const cardBookmarkIconPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    setAttrs(cardBookmarkIconPath, {
      d: "M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z",
    });
    cardBookmarkIcon.appendChild(cardBookmarkIconPath);

    // book title name
    const cardTitle = document.createElement("h2");
    cardTitle.classList.add(
      ...[
        "card__title",
        "_text",
        "_text--header",
        "_text--bold",
        "--size-context-rg-static",
      ],
    );
    cardTitle.textContent = b.title;
    // card button area
    const cardButtonArea = document.createElement("div");
    cardButtonArea.classList.add(
      ...["card__button-area", "--size-context-md-static"],
    );
    const cardButtonBookmark = document.createElement("button");
    cardButtonBookmark.classList.add(
      ...["card__button", "card__button--bookmark"],
    );
    const cardButtonBookmarkSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    cardButtonBookmarkSvg.classList.add(...["card__button-icon"]);
    setAttrs(cardButtonBookmarkSvg, {
      height: "24px",
      viewBox: "0 -960 960 960",
      width: "24px",
    });
    const cardButtonBookmarkPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    setAttrs(cardButtonBookmarkPath, {
      d: "M713-600 600-713l56-57 57 57 141-142 57 57-198 198ZM200-120v-640q0-33 23.5-56.5T280-840h240v80H280v518l200-86 200 86v-278h80v400L480-240 200-120Zm80-640h240-240Z",
    });
    cardButtonBookmarkSvg.appendChild(cardButtonBookmarkPath);
    cardButtonBookmark.appendChild(cardButtonBookmarkSvg);
    cardButtonArea.appendChild(cardButtonBookmark);

    const cardButtonDividerSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    cardButtonDividerSvg.classList.add(...["card__button-divider"]);
    const cardButtonDividerLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line",
    );
    setAttrs(cardButtonDividerLine, {
      x1: "50%",
      y1: "0",
      x2: "50%",
      y2: "100%",
    });
    cardButtonDividerSvg.appendChild(cardButtonDividerLine);
    cardButtonArea.appendChild(cardButtonDividerSvg);

    const cardButtonDelete = document.createElement("button");
    cardButtonDelete.classList.add(...["card__button", "card__button--delete"]);
    const cardButtonDeleteSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    cardButtonDeleteSvg.classList.add(...["card__button-icon"]);
    setAttrs(cardButtonDeleteSvg, { viewBox: "0 -960 960 960" });
    setAttrs(cardButtonDeleteSvg, {
      height: "24px",
      width: "24px",
    });
    const cardButtonDeletePath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    setAttrs(cardButtonDeletePath, {
      d: "M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z",
    });
    cardButtonDeleteSvg.appendChild(cardButtonDeletePath);
    cardButtonDelete.appendChild(cardButtonDeleteSvg);
    cardButtonArea.appendChild(cardButtonDelete);

    // card book image
    const cardBookImageContainer = document.createElement("div");
    cardBookImageContainer.classList.add(...["card__book-img-container"]);
    const cardBookImage = document.createElement("img");
    cardBookImage.classList.add(...["card__book-img"]);
    setAttrs(cardBookImage, {
      src: b.cover,
      alt: "Book Cover Image",
    });
    cardBookImageContainer.appendChild(cardBookImage);

    // card data area
    const cardDataContainer = document.createElement("div");
    cardDataContainer.classList.add(
      ...["card__data-container", "--size-context-xs-static"],
    );
    const cardAuthor = document.createElement("p");
    cardAuthor.classList.add(
      ...[
        "card__author",
        "_text",
        "_text--header",
        "_text--bold",
        "--size-context-sm-static",
      ],
    );
    cardAuthor.textContent = b.author;
    const cardPages = document.createElement("p");
    cardPages.classList.add(...["card__pages", "_text", "_text--normal"]);
    const cardPagesSpan = document.createElement("span");
    cardPagesSpan.textContent = b.pages;
    cardPagesSpan.classList.add(...["_text", "_text--header", "_text--bold"]);
    const cardStatus = document.createElement("p");
    cardStatus.classList.add(...["card__status", "_text", "_text--normal"]);
    const cardStatusSpan = document.createElement("span");
    cardStatusSpan.classList.add(...["_text", "_text--header", "_text--bold"]);
    cardStatusSpan.textContent = b.hasRead ? "Has" : "Not";

    cardPages.appendChild(cardPagesSpan);
    cardStatus.appendChild(cardStatusSpan);
    cardDataContainer.appendChild(cardAuthor);
    cardDataContainer.appendChild(cardPages);
    cardDataContainer.appendChild(cardStatus);

    // bringing everything together
    card.appendChild(cardBookmarkIcon);
    card.appendChild(cardTitle);
    card.appendChild(cardButtonArea);
    card.appendChild(cardBookImageContainer);
    card.appendChild(cardDataContainer);

    ctr.appendChild(cardFlexContainer);
  }
}

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

  // TEST
  library.addBook("Andy Weir", "Hail Mary", 496, "assets/images/hail-mary.jpg");
  library.books[0].toggleRead();
  library.addBook(
    "Becky Chambers",
    "Monk and Robot",
    496,
    "assets/images/monk-and-robot.jpg",
  );

  buildExistingBooks(library.books, cardsCtr);
  // TEST

  // theme switcher handler
  themeButton.addEventListener("click", () => {
    const currTheme = root.getAttribute(THEME_REF_NAME);

    let newTheme = currTheme.toLowerCase() === "light" ? "dark" : "light";

    root.setAttribute(THEME_REF_NAME, newTheme);

    localStorage.setItem(THEME_REF_NAME, newTheme); // persist theme per session
  });
}

main();
