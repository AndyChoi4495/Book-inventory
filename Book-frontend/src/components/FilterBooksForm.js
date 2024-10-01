import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

function FilterBooksForm({ formData, setFormData, handleFilter }) {
    const genres = [
        '',
        'Fiction',
        'Non-Fiction',
        'Mystery',
        'Sci-Fi',
        'Fantasy',
        'Biography',
        'History',
        'Children',
        'Other',
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleFilter();
    };

    const onReset = () => {
        setFormData({
            title: '',
            author: '',
            genre: '',
            publication_date: '',
        });
        handleFilter(true);
    };

    return (
        <Form onSubmit={onSubmit}>
            <Row className="g-3">
                <Col md={3}>
                    <Form.Group controlId="filterTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={3}>
                    <Form.Group controlId="filterAuthor">
                        <Form.Label>Author</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col md={3}>
                    <Form.Group controlId="filterGenre">
                        <Form.Label>Genre</Form.Label>
                        <Form.Select name="genre" value={formData.genre} onChange={handleChange}>
                            {genres.map((genreOption, idx) => (
                                <option key={idx} value={genreOption}>
                                    {genreOption === '' ? 'All' : genreOption}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={3}>
                    <Form.Group controlId="filterPublicationDate">
                        <Form.Label>Publication Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="publication_date"
                            value={formData.publication_date}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col>
                    <Button variant="primary" type="submit" className="me-2">
                        Filter
                    </Button>
                    <Button variant="secondary" type="button" onClick={onReset}>
                        Reset
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default FilterBooksForm;
