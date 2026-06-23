import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import AddBookForm from './components/AddBookForm';
import BooksList from './components/BooksList';
import { AlertProvider } from './components/Alert';
import './App.css';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AlertProvider>
                <Router>
                    <Navbar />
                    <div className="container mt-5 pt-4">
                        <Routes>
                            <Route path="/" element={<Navigate to="/books" />} />
                            <Route path="/books" element={<BooksList />} />
                            <Route path="/add" element={<AddBookForm />} />
                            <Route path="/edit/:id" element={<AddBookForm />} />
                        </Routes>
                    </div>
                </Router>
            </AlertProvider>
        </QueryClientProvider>
    );
}

export default App;
