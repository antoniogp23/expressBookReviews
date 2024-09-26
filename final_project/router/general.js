const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const newUser = { username, password };
    users.push(newUser);

    return res.status(201).json({ message: 'User registered successfully' });
});

// Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const bookDetails = books[isbn];
        if (bookDetails) {
            // If book details are found, return them as a JSON response
            return res.status(200).json(bookDetails);
        } else {
            // If book details are not found, return an appropriate message
            return res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error fetching book details', error: error.message });
    }
});
  
// Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        // Iterate through the books
        for (const bookKey of Object.keys(books)) {
            const book = books[bookKey];
            if (book.author === author) {
                // Found a book by the specified author
                return res.status(200).json(book);
            }
        }
        // If no book is found by the specified author
        return res.status(404).json({ message: 'No book found for this author' });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching book details', error: error.message });
    }
});

// Get all books based on title using async-await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        // Iterate through the books
        for (const bookKey of Object.keys(books)) {
            const book = books[bookKey];
            if (book.title === title) {
                // Found a book with the specified title
                return res.status(200).json(book);
            }
        }
        // If no book is found with the specified title
        return res.status(404).json({ message: 'No book with this title' });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching book details', error: error.message });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
   

    const bookDetails = books[isbn]; 
    if (bookDetails) {
        // If book details are found, return them as a JSON response
        return res.status(200).json(bookDetails);
      } else {
        // If book details are not found, return an appropriate message
        return res.status(404).json({ message: 'Book not found' });
      }
});

module.exports.general = public_users;