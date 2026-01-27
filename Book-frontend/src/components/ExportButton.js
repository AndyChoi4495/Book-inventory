import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import api from '../services/api';

function ExportButton() {
  const handleExport = async (format) => {
    try {
      const response = await api.get(`/api/books/export?format=${format}`, {
        responseType: 'blob',
      });

      let filename = 'books_inventory';
      if (format === 'csv') filename += '.csv';
      else if (format === 'json') filename += '.json';

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      alert('Failed to export data. Please try again.');
      console.error(error);
    }
  };

  return (
    <ButtonGroup>
      <Button variant="success" onClick={() => handleExport('csv')}>
        Export CSV
      </Button>
      <Button variant="primary" onClick={() => handleExport('json')}>
        Export JSON
      </Button>
    </ButtonGroup>
  );
}

export default ExportButton;
