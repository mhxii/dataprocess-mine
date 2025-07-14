// CSVViewer.js
import React, { useState, useEffect } from 'react';
import { FileCheck, Search } from 'lucide-react';
import { getFile } from '../services/api';
import JSZip from 'jszip';
import Papa from 'papaparse';

const CSVViewer = ({ selectedFile, filterText, setFilterText, currentPage, setCurrentPage }) => {
  const [viewMode, setViewMode] = useState('cleaned'); // cleaned | original | comparison
  const [cleanedData, setCleanedData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  

  const rowsPerPage = 50;

  useEffect(() => {
    if (!selectedFile) return;

    const nameZip = `${selectedFile.name.replace(/\.[^/.]+$/, '')}.zip`;

    const loadZipAndParse = async () => {
      try {
        const blob = await getFile(nameZip);
        const zip = await JSZip.loadAsync(blob);

        const originalCsvName = Object.keys(zip.files).find(name => name.startsWith("Original_"));
        const cleanedCsvName = Object.keys(zip.files).find(name => name.startsWith("Cleaned_"));

        const originalCsv = await zip.file(originalCsvName).async("string");
        const cleanedCsv = await zip.file(cleanedCsvName).async("string");

        const parsedOriginal = Papa.parse(originalCsv, { header: true }).data;
        const parsedCleaned = Papa.parse(cleanedCsv, { header: true }).data;

        setOriginalData(parsedOriginal);
        setCleanedData(parsedCleaned);
      } catch (error) {
        console.error("Erreur de lecture du ZIP :", error);
      }
    };

    loadZipAndParse();
  }, [selectedFile]);

  const generateComparison = () => {
    return cleanedData.map((row, index) => {
      const originalRow = originalData[index] || {};
      return Object.keys(row).reduce((acc, key) => {
        const cleanedValue = row[key] ?? "";
        const originalValue = originalRow[key] ?? "";
        acc[key] = {
          value: cleanedValue,
          changed: cleanedValue !== originalValue,
        };
        return acc;
      }, {});
    });
  };

  const dataToRender =
    viewMode === 'cleaned'
      ? cleanedData
      : viewMode === 'original'
      ? originalData
      : generateComparison();

  const filteredData = dataToRender.filter((row) => {
    const lowerFilter = filterText?.toLowerCase?.() || "";

    if (viewMode === 'comparison') {
      return Object.values(row).some((cell) => {
        const value = cell?.value ?? "";
        return value.toString().toLowerCase().includes(lowerFilter);
      });
    } else {
      return Object.values(row).some((val) => {
        const value = val ?? "";
        return value.toString().toLowerCase().includes(lowerFilter);
      });
    }
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
console.log("Data cleaned:", cleanedData);
console.log("Data original:", originalData);
console.log("DataToRender:", dataToRender);
console.log("FilteredData:", filteredData);
console.log("PaginatedData:", paginatedData);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Visualisation des données</h2>
        <div className="btn-group">
          <button
            className={`btn btn-outline-primary ${viewMode === 'cleaned' ? 'active' : ''}`}
            onClick={() => setViewMode('cleaned')}
          >
            Données nettoyées
          </button>
          <button
            className={`btn btn-outline-primary ${viewMode === 'original' ? 'active' : ''}`}
            onClick={() => setViewMode('original')}
          >
            Données originales
          </button>
          <button
            className={`btn btn-outline-primary ${viewMode === 'comparison' ? 'active' : ''}`}
            onClick={() => setViewMode('comparison')}
          >
            Comparaison
          </button>
        </div>
      </div>

      {selectedFile && (
        <div className="alert alert-info mb-3">
          <FileCheck className="me-2" size={16} />
          Fichier: <strong>{selectedFile.name}</strong> |
          Statut: <strong>{selectedFile.status}</strong> |
          Date: <strong>{selectedFile.uploadDate}</strong>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filtrer les données..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-end">
              <span className="text-muted">
                {filteredData.length} lignes | Page {currentPage} sur {totalPages}
              </span>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  {filteredData.length > 0 &&
                    Object.keys(filteredData[0]).map((key) => <th key={key}>{key}</th>)}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr key={index}>
                    {viewMode === 'comparison'
                      ? Object.values(row).map((cell, i) => (
                          <td
                            key={i}
                            className={cell.changed ? 'bg-warning fw-bold' : ''}
                          >
                            {cell.value}
                          </td>
                        ))
                      : Object.values(row).map((value, i) => <td key={i}>{value}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer">
          <nav>
            <ul className="pagination justify-content-center mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                >
                  Précédent
                </button>
              </li>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <li
                    key={page}
                    className={`page-item ${currentPage === page ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => setCurrentPage(page)}>
                      {page}
                    </button>
                  </li>
                );
              })}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Suivant
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CSVViewer;
