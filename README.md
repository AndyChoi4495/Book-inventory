# Book Inventory System

## Project Overview

The **Book Inventory System** is a full-stack application designed to manage a collection of books efficiently. It allows users to:

-   **Add New Books:** Input detailed information about books into the inventory.
-   **View Books:** Display a comprehensive list of all books with their details.
-   **Filter Books:** Search and filter books based on title, author, genre, or publication date.
-   **Export Data:** Download the inventory data in both CSV and JSON formats for offline access or reporting.

This system is built with a **Node.js** and **Express** backend, a **PostgreSQL** database, and a **React** frontend, ensuring scalability, performance, and a user-friendly interface.

## Technology Stack

### Backend

-   **Node.js** (v14.x or higher)
-   **Express.js**
-   **Sequelize** (ORM)
-   **PostgreSQL** (Database)
-   **dotenv** (Environment Variables)
-   **cors** (Cross-Origin Resource Sharing)
-   **morgan** (HTTP Request Logger)
-   **express-validator** (Input Validation)
-   **json2csv** (Data Export)

### Frontend

-   **React**
-   **React Router DOM**
-   **Axios** (HTTP Client)
-   **Bootstrap** & **React Bootstrap** (UI Styling)

## Inventory.sql

### Create the Inventory table

-   CREATE TABLE IF NOT EXISTS "Inventory" (
-   entry_id SERIAL PRIMARY KEY,
-   title VARCHAR(255) NOT NULL,
-   author VARCHAR(255) NOT NULL,
-   genre VARCHAR(100) NOT NULL,
-   publication_date DATE NOT NULL,
-   isbn VARCHAR(20) NOT NULL UNIQUE,
-   CHECK (isbn ~ '^(97(8|9))?\d{9}(\d|X)$')
-   );

## .ENV File

-   PORT=5000
-   DB_HOST=localhost
-   DB_USER=postgres
-   DB_PASSWORD=your_password
-   DB_NAME=your_database_name
-   DB_PORT=5432

## Setting up the Front-end

-   cd Book-inventory/book-frontend
-   npm i
-   npm start

## Setting up the Back-end

-   cd Book-inventory/book-backend
-   npm i
-   npm run dev or npm start
