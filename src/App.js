import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import AddBookForm from './components/AddBookForm';
import BooksList from './components/BooksList';
import { AlertProvider } from './components/Alert';
import './App.css';

function App() {
    return (
        <AlertProvider>
            <Router>
                <Navbar />
                <div className="container mt-5 pt-4">
                    <Routes>
                        <Route path="/" element={<Navigate to="/books" />} />
                        <Route path="/books" element={<BooksList />} />
                        <Route path="/add" element={<AddBookForm />} />
                    </Routes>
                </div>
            </Router>
        </AlertProvider>
    );
}

export default App;
