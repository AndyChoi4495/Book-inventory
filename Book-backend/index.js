const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./config/database');
const Inventory = require('./models/inventory');
const { body, validationResult } = require('express-validator');
const { Parser } = require('json2csv');
const { Op } = require('sequelize');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('dev'));

// Test Route
app.get('/', (req, res) => {
    res.send('Book Inventory System API');
});

//1. Add New Book

app.post(
    '/api/books',
    [
        body('title').notEmpty().withMessage('Title is required').isLength({ max: 255 }),
        body('author').notEmpty().withMessage('Author is required').isLength({ max: 255 }),
        body('genre').notEmpty().withMessage('Genre is required').isLength({ max: 100 }),
        body('publication_date').notEmpty().withMessage('Publication Date is required').isISO8601().toDate(),
        body('isbn')
            .notEmpty()
            .withMessage('ISBN is required')
            .matches(/^(97(8|9))?\d{9}(\d|X)$/i)
            .withMessage('Invalid ISBN format')
            .isLength({ min: 10, max: 13 }),
    ],
    async (req, res) => {
        // Validate Inputs
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Destructure request body
        const { title, author, genre, publication_date, isbn } = req.body;

        try {
            // Check for duplicate ISBN
            const existingBook = await Inventory.findOne({ where: { isbn } });
            if (existingBook) {
                return res.status(400).json({ errors: [{ msg: 'A book with this ISBN already exists.' }] });
            }

            // Create new book
            const newBook = await Inventory.create({
                title,
                author,
                genre,
                publication_date,
                isbn,
            });

            return res.status(201).json({ message: 'Book added successfully!', book: newBook });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Server Error');
        }
    }
);

// 2. Filter Books

app.get('/api/books', async (req, res) => {
    const { title, author, genre, publication_date } = req.query;

    // Build the query object
    let query = {};

    if (title) {
        query.title = { [Op.iLike]: `%${title}%` };
    }
    if (author) {
        query.author = { [Op.iLike]: `%${author}%` };
    }
    if (genre) {
        query.genre = genre;
    }
    if (publication_date) {
        query.publication_date = publication_date;
    }

    try {
        const books = await Inventory.findAll({ where: query });
        return res.json({ count: books.length, books });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
});

//3. Export Data

app.get('/api/books/export', async (req, res) => {
    const { format } = req.query;

    if (!['csv', 'json'].includes(format.toLowerCase())) {
        return res.status(400).json({ errors: [{ msg: 'Invalid export format. Choose CSV or JSON.' }] });
    }

    try {
        const books = await Inventory.findAll();

        if (format.toLowerCase() === 'json') {
            return res.json({ count: books.length, books });
        } else if (format.toLowerCase() === 'csv') {
            const fields = ['entry_id', 'title', 'author', 'genre', 'publication_date', 'isbn'];
            const opts = { fields };
            const parser = new Parser(opts);
            const csv = parser.parse(books.map((book) => book.toJSON()));

            res.header('Content-Type', 'text/csv');
            res.attachment('books_inventory.csv');
            return res.send(csv);
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
});

// Sync Database and Start Server
const PORT = process.env.PORT || 5000;

sequelize
    .authenticate()
    .then(() => {
        console.log('Database connected...');
        return sequelize.sync();
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });
