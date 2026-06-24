// book object instantiation
function Book(title, author, pages, cover, hasRead) {
  if (!new.target) {
    throw Error("Book object not initialized with new keyword");
  }
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.cover = cover;
  this.hasRead = hasRead;
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
Library.prototype.addBook = function (title, author, pages, cover, hasRead) {
  this.books.push(new Book(title, author, pages, cover, hasRead));
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

function UILibraryHandler(
  library,
  cardsCtr,
  mainCtr,
  themeButton,
  addButton,
  THEME_REF_NAME,
) {
  this.root = document.documentElement;
  this.library = library;
  this.cardsCtr = cardsCtr;
  this.mainCtr = mainCtr;
  this.themeButton = themeButton;
  this.addButton = addButton;
  this.THEME_REF_NAME = THEME_REF_NAME;

  // theme switcher handler
  this.themeButton.addEventListener("click", () => {
    const currTheme = this.root.getAttribute(THEME_REF_NAME);

    let newTheme = currTheme.toLowerCase() === "light" ? "dark" : "light";

    this.root.setAttribute(THEME_REF_NAME, newTheme);

    localStorage.setItem(THEME_REF_NAME, newTheme); // persist theme per session
  });

  // add book handler
  this.addButton.addEventListener("click", () => {
    const dialog = this._getDialog();
    const containerParent = mainCtr.parentElement;
    containerParent.appendChild(dialog);

    this._buildAddBookDialog(dialog);

    dialog.showModal();
  });
}

// dialog creation helper
UILibraryHandler.prototype._getDialog = function () {
  const dialog = document.createElement("dialog");

  dialog.classList.add(...["dialog", "--size-context-md"]);

  // ensure dialog deletes itself after closing
  dialog.addEventListener("close", () => {
    dialog.remove();
  });

  return dialog;
};

// attribute setter helper
UILibraryHandler.prototype._setAttrs = function (el, attrs) {
  for (let key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

UILibraryHandler.prototype._removeExistingBooks = function () {
  while (this.cardsCtr.firstChild) {
    this.cardsCtr.removeChild(this.cardsCtr.firstChild);
  }
};

// build addBookDialog
UILibraryHandler.prototype._buildAddBookDialog = function (dialog) {
  // header
  const dialogHeader = document.createElement("div");
  dialogHeader.classList.add("dialog__header");
  const dialogTitle = document.createElement("h1");
  dialogTitle.classList.add(
    ...["dialog__title", "_text", "_text--header", "_text--bold"],
  );
  dialogTitle.textContent = "Add Book";
  const dialogExitButton = document.createElement("button");
  dialogExitButton.classList.add(...["dialog__exit-button"]);
  const dialogExitSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  dialogExitSvg.classList.add("dialog__exit-svg");
  this._setAttrs(dialogExitSvg, {
    class: "dialog__exit-svg",
    viewBox: "0 0 24 24",
  });
  const dialogExitSvgPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );
  this._setAttrs(dialogExitSvgPath, {
    d: "M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z",
  });

  dialogHeader.appendChild(dialogTitle);

  dialogHeader.appendChild(dialogExitButton);
  dialogExitButton.appendChild(dialogExitSvg);
  dialogExitSvg.appendChild(dialogExitSvgPath);

  // form
  const dialogForm = document.createElement("form");
  dialogForm.classList.add(...["dialog__form", "--size-context-sm"]);
  this._setAttrs(dialogForm, { action: "", method: "" });

  // form top
  const dialogFormTop = document.createElement("div");
  dialogFormTop.classList.add("dialog__form-top");

  const dialogFormPlease = document.createElement("div");
  dialogFormPlease.classList.add(
    ...["dialog__form-please", "_text", "_text--normal"],
  );
  dialogFormPlease.textContent = "Please complete all required (";
  const dialogFormPleaseSpan = document.createElement("span");
  dialogFormPleaseSpan.classList.add(
    ...["dialog__form-required", "_text", "_text--bold"],
  );
  dialogFormPleaseSpan.textContent = "*";
  dialogFormPlease.appendChild(dialogFormPleaseSpan);
  dialogFormPlease.appendChild(document.createTextNode(") fields."));

  // p1
  const DialogFormTopP1 = document.createElement("p");
  DialogFormTopP1.classList.add(...["dialog__form-top-p"]);
  const DialogFormTopP1Label = document.createElement("label");
  DialogFormTopP1Label.classList.add(
    ...[
      "dialog__form-label",
      "dialog__form-label--text",
      "_text",
      "_text--normal",
    ],
  );
  DialogFormTopP1Label.setAttribute("for", "title");
  DialogFormTopP1Label.textContent = "Title:";
  const DialogFormTopP1Input = document.createElement("input");
  DialogFormTopP1Input.classList.add(
    ...[
      "dialog__form-input",
      "dialog__form-input--text",
      "_text",
      "_text--normal",
      "_text--bold",
      "--size-context-xs",
    ],
  );
  this._setAttrs(DialogFormTopP1Input, {
    type: "text",
    id: "title",
    name: "book_title",
    placeholder: "Hail Mary",
    required: "",
  });
  DialogFormTopP1.appendChild(DialogFormTopP1Label);
  DialogFormTopP1.appendChild(DialogFormTopP1Input);
  DialogFormTopP1.appendChild(document.createElement("span"));

  // p2
  const DialogFormTopP2 = document.createElement("p");
  DialogFormTopP2.classList.add(...["dialog__form-top-p"]);
  const DialogFormTopP2Label = document.createElement("label");
  DialogFormTopP2Label.classList.add(
    ...[
      "dialog__form-label",
      "dialog__form-label--text",
      "_text",
      "_text--normal",
    ],
  );
  DialogFormTopP2Label.setAttribute("for", "author");
  DialogFormTopP2Label.textContent = "Author:";
  const DialogFormTopP2Input = document.createElement("input");
  DialogFormTopP2Input.classList.add(
    ...[
      "dialog__form-input",
      "dialog__form-input--text",
      "_text",
      "_text--normal",
      "_text--bold",
      "--size-context-xs",
    ],
  );
  this._setAttrs(DialogFormTopP2Input, {
    type: "text",
    id: "author",
    name: "book_title",
    placeholder: "Andy Weir",
    required: "",
  });
  DialogFormTopP2.appendChild(DialogFormTopP2Label);
  DialogFormTopP2.appendChild(DialogFormTopP2Input);
  DialogFormTopP2.appendChild(document.createElement("span"));

  // divs
  const DialogFormTopDiv = document.createElement("div");
  DialogFormTopDiv.classList.add("dialog__form-top-div");

  const DialogFormTopDivP1 = document.createElement("p");
  DialogFormTopDivP1.classList.add(
    ...["dialog__form-top-div-p", "dialog__form-top-div-p--left"],
  );
  const DialogFormTopDivP1Label = document.createElement("label");
  DialogFormTopDivP1Label.classList.add(
    ...[
      "dialog__form-label",
      "dialog__form-label--number",
      "_text",
      "_text--normal",
    ],
  );
  DialogFormTopDivP1Label.setAttribute("for", "pages");
  DialogFormTopDivP1Label.textContent = "Pages:";
  const DialogFormTopDivP1Input = document.createElement("input");
  DialogFormTopDivP1Input.classList.add(
    ...[
      "dialog__form-input",
      "dialog__form-input--number",
      "_text",
      "_text--normal",
      "_text--bold",
      "--size-context-xs",
    ],
  );
  this._setAttrs(DialogFormTopDivP1Input, {
    type: "number",
    step: "1",
    id: "pages",
    name: "book_pages",
    placeholder: "496",
    min: "1",
    max: "10000",
    required: "",
  });
  DialogFormTopDivP1.appendChild(DialogFormTopDivP1Label);
  DialogFormTopDivP1.appendChild(DialogFormTopDivP1Input);
  DialogFormTopDivP1.appendChild(document.createElement("span"));

  const DialogFormTopDivP2 = document.createElement("p");
  DialogFormTopDivP2.classList.add(
    ...[
      "dialog__form-top-div-p",
      "dialog__form-top-div-p--right",
      "dialog__form-top-div-p--gap",
    ],
  );
  const DialogFormTopDivP2Label = document.createElement("label");
  DialogFormTopDivP2Label.classList.add(
    ...[
      "dialog__form-label",
      "dialog__form-label--checkbox",
      "_text",
      "_text--normal",
    ],
  );
  DialogFormTopDivP2Label.setAttribute("for", "has-read");
  DialogFormTopDivP2Label.textContent = "Has Read:";
  const DialogFormTopDivP2Input = document.createElement("input");
  DialogFormTopDivP2Input.classList.add(
    ...[
      "dialog__form-input",
      "dialog__form-input--checkbox",
      "_text",
      "_text--normal",
      "_text--bold",
      "--size-context-xs",
    ],
  );
  this._setAttrs(DialogFormTopDivP2Input, {
    type: "checkbox",
    id: "has-read",
    name: "book_has-read",
  });
  DialogFormTopDivP2.appendChild(DialogFormTopDivP2Label);
  DialogFormTopDivP2.appendChild(DialogFormTopDivP2Input);

  DialogFormTopDiv.appendChild(DialogFormTopDivP1);
  DialogFormTopDiv.appendChild(DialogFormTopDivP2);

  // p3
  const DialogFormTopP3 = document.createElement("p");
  DialogFormTopP3.classList.add(...["dialog__form-top-p"]);
  const DialogFormTopP3Label = document.createElement("label");
  DialogFormTopP3Label.classList.add(
    ...[
      "dialog__form-label",
      "dialog__form-label--image",
      "_text",
      "_text--normal",
    ],
  );
  DialogFormTopP3Label.setAttribute("for", "image");
  DialogFormTopP3Label.textContent = "Cover:";
  const DialogFormTopP3Input = document.createElement("input");
  DialogFormTopP3Input.classList.add(
    ...[
      "dialog__form-input--image",
      "_text",
      "_text--normal",
      "_text--bold",
      "--size-context-xs",
    ],
  );
  this._setAttrs(DialogFormTopP3Input, {
    type: "file",
    id: "image",
    name: "book_cover",
    accept: "image/*.png, image/*.jpeg, image/*.jpg",
  });

  DialogFormTopP3.appendChild(DialogFormTopP3Label);
  DialogFormTopP3.appendChild(DialogFormTopP3Input);
  DialogFormTopP3.appendChild(document.createElement("span"));

  dialogFormTop.appendChild(dialogFormPlease);
  dialogFormTop.appendChild(DialogFormTopP1);
  dialogFormTop.appendChild(DialogFormTopP2);
  dialogFormTop.appendChild(DialogFormTopDiv);
  dialogFormTop.appendChild(DialogFormTopP3);
  dialogForm.appendChild(dialogFormTop);

  // form bottom
  const dialogFormBottom = document.createElement("div");
  dialogFormBottom.classList.add("dialog__form-bottom");

  const dialogFormCoverContainer = document.createElement("div");
  dialogFormCoverContainer.classList.add("dialog__form-cover-container");
  const dialogFormCoverImg = document.createElement("img");
  dialogFormCoverImg.classList.add("dialog__form-cover-img");
  this._setAttrs(dialogFormCoverImg, {
    src: "",
    alt: "BookCoverSelected",
  });
  dialogFormCoverContainer.appendChild(dialogFormCoverImg);
  const dialogFormBottomDiv = document.createElement("div");
  dialogFormBottomDiv.classList.add(
    ...["dialog__form-bottom-div", "--size-context-rg"],
  );
  const dialogFormButton = document.createElement("button");
  dialogFormButton.classList.add(
    ...["dialog__form-button", "_text", "_text--header", "_text--bold"],
  );
  dialogFormButton.setAttribute("submit", "");
  dialogFormButton.textContent = "Submit";
  dialogFormBottomDiv.appendChild(dialogFormButton);

  dialogFormBottom.appendChild(dialogFormCoverContainer);
  dialogFormBottom.appendChild(dialogFormBottomDiv);
  dialogForm.appendChild(dialogFormBottom);
  // functionality

  dialogFormCoverImg.addEventListener("error", () => {
    dialogFormCoverImg.setAttribute("src", "./assets/images/default-cover.jpg");
  });

  // -- image update selection
  DialogFormTopP3Input.addEventListener("input", () => {
    const url = URL.createObjectURL(DialogFormTopP3Input.files[0]);
    dialogFormCoverImg.setAttribute("src", url);
  });

  // -- prevent submission from sending data to server
  dialogForm.addEventListener("submit", (e) => e.preventDefault());

  dialog.addEventListener("click", (e) => {
    const target = e.target.classList;

    switch (true) {
      // -- exit button actually exits dialog
      case target.contains("dialog__exit-button"):
        console.log("Deleting dialog");
        dialog.close();
        break;
      // -- submit button
      case target.contains("dialog__form-button"):
        console.log("Form submission attempt");
        const form = dialog.querySelector(".dialog__form");

        if (form.checkValidity()) {
          console.log("Validity successful, uploading entry.");
          e.preventDefault();

          const title = DialogFormTopP1Input.value;
          const author = DialogFormTopP2Input.value;
          const pages = DialogFormTopDivP1Input.value;
          const hasRead = DialogFormTopDivP2Input.checked;
          const cover =
            DialogFormTopP3Input.files.length === 0
              ? "./assets/images/default-cover.jpg"
              : URL.createObjectURL(DialogFormTopP3Input.files[0]);

          this.library.addBook(title, author, pages, cover, hasRead);
          this.buildExistingBooks();
          form.requestSubmit();
          dialog.close();
        } else {
          console.log("Validity unsuccesful");
        }
        break;
    }
  });

  // adding everything together
  dialog.appendChild(dialogHeader);
  dialog.appendChild(dialogForm);
};

// display current books in library
UILibraryHandler.prototype.buildExistingBooks = function () {
  this._removeExistingBooks();

  for (let b of this.library.books) {
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
    this._setAttrs(cardBookmarkIcon, {
      viewBox: "0 0 24 24",
    });
    const cardBookmarkIconPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    this._setAttrs(cardBookmarkIconPath, {
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
    this._setAttrs(cardButtonBookmarkSvg, {
      height: "24px",
      viewBox: "0 -960 960 960",
      width: "24px",
    });
    const cardButtonBookmarkPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    this._setAttrs(cardButtonBookmarkPath, {
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
    this._setAttrs(cardButtonDividerLine, {
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
    this._setAttrs(cardButtonDeleteSvg, { viewBox: "0 -960 960 960" });
    this._setAttrs(cardButtonDeleteSvg, {
      height: "24px",
      width: "24px",
    });
    const cardButtonDeletePath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    this._setAttrs(cardButtonDeletePath, {
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
    this._setAttrs(cardBookImage, {
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
        "--size-context-xs-static",
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

    card.addEventListener("click", (e) => {
      const target = e.target.classList;
      const id = card.id;
      const bookIndex = this.library.findBookIndex(id);

      if (!bookIndex && bookIndex !== 0)
        throw Error(`Book index for ${id} not found`);

      const bookRef = this.library.books[bookIndex];

      switch (true) {
        // toggle read status
        case target.contains("card__button--bookmark"):
          console.log(`Toggling ${id} status`);

          bookRef.toggleRead();

          this.buildExistingBooks();

          break;
        // delete book
        case target.contains("card__button--delete"):
          console.log(`Deleting ${id}`);

          this.library.deleteBook(id);
          card.parentElement.remove();

          break;
        default:
          console.log(`No action taken for ${id} click`);
      }
    });

    // bringing everything together
    card.appendChild(cardBookmarkIcon);
    card.appendChild(cardTitle);
    card.appendChild(cardButtonArea);
    card.appendChild(cardBookImageContainer);
    card.appendChild(cardDataContainer);

    this.cardsCtr.appendChild(cardFlexContainer);
  }
};

// set previously saved theme on localstorage
UILibraryHandler.prototype.setSavedTheme = function () {
  const savedTheme = localStorage.getItem(this.THEME_REF_NAME);

  if (localStorage.getItem(this.THEME_REF_NAME))
    this.root.setAttribute(this.THEME_REF_NAME, savedTheme);
};

function main() {
  // keywords
  const THEME_REF_NAME = "data-theme";

  // interactive buttons
  const themeButton = document.querySelector(".header__toggle-button");
  const addBookButton = document.querySelector(".header__add-button");
  const cardsContainer = document.querySelector(".main-content");
  const mainContainer = document.querySelector(".container");

  // top level handlers
  const library = new Library();
  const uiLib = new UILibraryHandler(
    library,
    cardsContainer,
    mainContainer,
    themeButton,
    addBookButton,
    THEME_REF_NAME,
  );

  // set previously saved theme on localstorage
  uiLib.setSavedTheme();

  // TEST
  library.addBook("Andy Weir", "Hail Mary", 496, "assets/images/hail-mary.jpg");
  library.addBook(
    "Becky Chambers",
    "Monk and Robot",
    496,
    "assets/images/monk-and-robot.jpg",
  );

  library.books[0].toggleRead();

  uiLib.buildExistingBooks(library, cardsContainer);
  // TEST
}

main();
