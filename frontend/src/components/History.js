import React from 'react';
import { FileText, Eye, Download, Trash2, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';
const API_BASE_URL = 'http://localhost:9000';

const CSVHistory = ({ files, setActiveTab, setSelectedFile, setCsvData }) => {
  const getStatusBadge = (status) => {
    const badges = {
      completed: <span className="badge bg-success"><CheckCircle size={12} className="me-1" />Terminé</span>,
      processing: <span className="badge bg-warning"><Clock size={12} className="me-1" />En cours</span>,
      error: <span className="badge bg-danger"><AlertCircle size={12} className="me-1" />Erreur</span>
    };
    return badges[status] || badges.completed;
  };

  const getIssuesBadges = (issues) => {
    const issueLabels = {
      duplicates: 'Doublons',
      missing_values: 'Valeurs manquantes',
      outliers: 'Valeurs aberrantes',
      formatting: 'Format'
    };

    return issues.map(issue => (
      <span key={issue} className="badge bg-secondary me-1 mb-1">
        {issueLabels[issue]}
      </span>
    ));
  };

  const handleDownloadZip = async (file) => {
    console.log(file);
    const nameZip = `${file.name.replace(/\.[^/.]+$/, '')}.zip`;
    const zipUrl = `${API_BASE_URL}/files/${nameZip}`;
    console.log(zipUrl);

    try {
      const response = await fetch(zipUrl);
      if (!response.ok) throw new Error("Erreur téléchargement");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${nameZip}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Téléchargement échoué : " + error.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Historique des fichiers</h2>
        <div className="input-group" style={{ width: '300px' }}>
          <span className="input-group-text">
            <Search size={16} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher..."
          />
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Fichier</th>
                  <th>Statut</th>
                  <th>Date d'upload</th>
                  <th>Taille originale</th>
                  <th>Taille nettoyée</th>
                  <th>Lignes</th>
                  <th>Problèmes détectés</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map(file => (
                  <tr key={file.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <FileText size={16} className="me-2 text-primary" />
                        {file.name}
                      </div>
                    </td>
                    <td>{getStatusBadge(file.status)}</td>
                    <td>{file.uploadDate}</td>
                    <td>{file.originalSize}</td>
                    <td>{file.cleanedSize}</td>
                    <td>
                      <span className="text-muted">{file.rowsOriginal}</span>
                      {file.rowsCleaned > 0 && (
                        <span className="text-success"> → {file.rowsCleaned}</span>
                      )}
                    </td>
                    <td>{getIssuesBadges(file.issues)}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => {
                            setSelectedFile(file);
                            setActiveTab('viewer');
                            setCsvData([
                              { id: 1, name: 'John Doe', age: 25 },
                              { id: 2, name: 'Jane Doe', age: 30 }
                            ]);
                          }}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn btn-outline-success"
                          onClick={() => handleDownloadZip(file)}
                        >
                          <Download size={14} />
                        </button>
                        <button className="btn btn-outline-danger">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVHistory;
