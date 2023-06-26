const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
//write code to check is the username is valid
  const hasUser = users.find(user => user.username === username);
  if (hasUser) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
//write code to check if username and password match the one we have in records.
  const hasUser = users.find(user => user.username === username && user.password === password);
  if (hasUser) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const {username, password} = req.body;
  if (authenticatedUser(username,password)) {
    //   // Create a token
    let accessToken = jwt.sign({
      data: password
    }, 'fingerprint_customer', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }

    return res.status(200).send('Customer successfully logged in');
  } else {
    return res.status(401).json({message: "Login Failed"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const {isbn} = req.params;
  const {review} = req.query;
  const book = books[isbn];
  if (book) {
    let customerUsername = req.customer["username"];
    book["reviews"][customerUsername] = [review];
    books[isbn]=book
    return res.status(200).send(`The review for the book with ISBN ${isbn} has bees added/updated.`);
  } else {
    return res.status(404).json({message: "Book Not Found"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const {isbn} = req.params;
  const {review} = req.query;
  const book = books[isbn];
  if (book) {
    let customerUsername = req.customer["data"];
    delete book["reviews"][customerUsername];
    books[isbn]=book
    return res.status(200).send(`Reviens for the ISBN ${isbn} posted by the user ${customerUsername} deleted.`);
  } else {
    return res.status(404).json({message: "Book Not Found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
