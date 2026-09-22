import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import './PdfViewer.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function PdfViewer({ pdfFile }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [error, setError] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(error) {
    setError(`Error al cargar PDF: ${error.message}`);
    console.error('PDF Load Error:', error);
  }

  const handlePrevious = () => {
    setPageNumber(Math.max(1, pageNumber - 1));
  };

  const handleNext = () => {
    setPageNumber(Math.min(numPages, pageNumber + 1));
  };

  if (error) {
    return (
      <div className="pdf-viewer">
        <div style={{ padding: '20px', color: 'red' }}>
          <h2>Error</h2>
          <p>{error}</p>
          <p>Verificando archivo: {pdfFile}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-viewer">
      <div className="toolbar">
        <button onClick={handlePrevious} disabled={pageNumber <= 1}>
          ◀ Anterior
        </button>
        <span className="page-info">
          Página {pageNumber} de {numPages || '...'}
        </span>
        <button onClick={handleNext} disabled={pageNumber >= numPages}>
          Siguiente ▶
        </button>
        <div className="zoom-controls">
          <button onClick={() => setScale(Math.max(0.5, scale - 0.2))}>−</button>
          <span>{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(Math.min(3, scale + 0.2))}>+</button>
        </div>
      </div>

      <div className="pdf-container">
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          onError={onDocumentLoadError}
          loading={<div style={{ padding: '20px' }}>Cargando PDF...</div>}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            loading={<div style={{ padding: '20px' }}>Cargando página...</div>}
            error={<div style={{ padding: '20px', color: '#999' }}>No se pudo cargar esta página</div>}
          />
        </Document>
      </div>
    </div>
  );
}
