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

## Database schema (migrations)

The schema is managed by **sequelize-cli migrations** (`Book-backend/migrations/`), so no manual `CREATE TABLE` is needed — run the migrations against a database with `DATABASE_URL` set:

-   cd Book-inventory/Book-backend
-   npm run migrate          # apply pending migrations
-   npm run migrate:status   # show applied/pending
-   npm run migrate:undo     # roll back the last migration

> Adopting migrations on a pre-existing `Inventory` table: the initial `create-inventory` migration is baselined (inserted into `SequelizeMeta`) so it is skipped, and only later migrations run.

The initial schema is equivalent to:

CREATE TABLE IF NOT EXISTS "Inventory" (  
entry_id SERIAL PRIMARY KEY,  
title VARCHAR(255) NOT NULL,  
author VARCHAR(255) NOT NULL,  
genre VARCHAR(100) NOT NULL,  
publication_date DATE NOT NULL,  
isbn VARCHAR(20) NOT NULL UNIQUE,  
CHECK (isbn ~ '^(97(8|9))?\d{9}(\d|X)$')  
);

## .ENV File

-   PORT=5000
-   DATABASE_URL=Your Database URL

## Setting up the Front-end

The front-end uses **Vite**. Set `VITE_API_URL` (backend base URL) in `Book-frontend/.env`.

-   cd Book-inventory/Book-frontend
-   npm i
-   npm run dev      # Vite dev server on :3000
-   npm run build    # production build to dist/
-   npm test         # Vitest

## Setting up the Back-end

-   cd Book-inventory/Book-backend
-   npm i
-   npm run dev or npm start
