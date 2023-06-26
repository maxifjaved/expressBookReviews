const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

async function findBooks(key, value) {
  let result = [];
  for (let id in books) {
    if (books[id][key] === value) {
      result.push(books[id]);
    }
  }
  return Promise.resolve(result);
}

async function getBooks() {
  try {
    return Promise.resolve(books);
  } catch (error) {
    console.error(`Error occurred: ${error}`);
  }
}

async function getBookByISBN(isbn) {
  try {
    const book = books[isbn];
    return Promise.resolve(book);
  } catch (error) {
    console.error(`Error occurred: ${error}`);
  }
}

public_users.post("/register", (req, res) => {
  const {username, password} = req.body;
  if (isValid(username)) {
    return res.status(409).json({message: "Username already exists"});
  } else {
    users.push({username, password});
    return res.status(201).json({message: "Customer successfully registered. Now you can login"});
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const mb = await getBooks();
  return res.status(200).json({books: mb});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const book = await getBookByISBN(req.params.isbn)
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book Not Found"});
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const book = await findBooks('author', req.params.author);
  return res.status(200).json({bookByAuthor: book});
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const book = await findBooks('title', req.params.title);
  return res.status(200).json({bookByTitle: book});
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const book = books[req.params.isbn]
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "Book Not Found"});
  }
});

module.exports.general = public_users;
