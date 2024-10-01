import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';

function Navbar() {
    const location = useLocation();

    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg" fixed="top">
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/books">
                    Book Inventory
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/books" active={location.pathname === '/books'}>
                            Books
                        </Nav.Link>
                        <Nav.Link as={Link} to="/add" active={location.pathname === '/add'}>
                            Add Book
                        </Nav.Link>
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
}

export default Navbar;
