import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  Filter, 
  Search, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Database,
  Settings,
  History,
  FileCheck,
  Calendar,
  TrendingUp
} from 'lucide-react';

const CSVDashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [files, setFiles] = useState([
    {
      id: 1,
      name: 'sales_data.csv',
      originalSize: '2.3 MB',
      cleanedSize: '1.8 MB',
      status: 'completed',
      uploadDate: '2024-01-15 10:30',
      cleaningTime: '2.5s',
      rowsOriginal: 15420,
      rowsCleaned: 12890,
      issues: ['duplicates', 'missing_values', 'outliers']
    },
    {
      id: 2,
      name: 'customer_data.csv',
      originalSize: '1.1 MB',
      cleanedSize: '0.9 MB',
      status: 'processing',
      uploadDate: '2024-01-15 11:15',
      cleaningTime: '-',
      rowsOriginal: 8750,
      rowsCleaned: 0,
      issues: []
    }
  ]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [csvData, setCsvData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(50);

  // Simulation de données CSV
  const mockCsvData = [
    { id: 1, name: 'John Doe', age: 25, city: 'New York', salary: 50000 },
    { id: 2, name: 'Jane Smith', age: 30, city: 'Los Angeles', salary: 60000 },
    { id: 3, name: 'Bob Johnson', age: 35, city: 'Chicago', salary: 55000 },
    { id: 4, name: 'Alice Brown', age: 28, city: 'Houston', salary: 52000 },
    { id: 5, name: 'Charlie Wilson', age: 32, city: 'Phoenix', salary: 58000 }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Simulation d'upload
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

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

  const filteredData = csvData.filter(row => 
    Object.values(row).some(value => 
      value.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="container-fluid vh-100 bg-light">
      <div className="row h-100">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-dark text-white p-0">
          <div className="d-flex flex-column h-100">
            <div className="p-3 border-bottom border-secondary">
              <h5 className="mb-0">
                <Database className="me-2" size={20} />
                CSV Cleaner
              </h5>
            </div>
            <nav className="flex-grow-1 p-3">
              <ul className="nav nav-pills flex-column">
                <li className="nav-item mb-2">
                  <button 
                    className={`nav-link w-100 text-start ${activeTab === 'upload' ? 'active' : 'text-white'}`}
                    onClick={() => setActiveTab('upload')}
                  >
                    <Upload size={16} className="me-2" />
                    Upload & Nettoyage
                  </button>
                </li>
                <li className="nav-item mb-2">
                  <button 
                    className={`nav-link w-100 text-start ${activeTab === 'history' ? 'active' : 'text-white'}`}
                    onClick={() => setActiveTab('history')}
                  >
                    <History size={16} className="me-2" />
                    Historique
                  </button>
                </li>
                <li className="nav-item mb-2">
                  <button 
                    className={`nav-link w-100 text-start ${activeTab === 'viewer' ? 'active' : 'text-white'}`}
                    onClick={() => setActiveTab('viewer')}
                  >
                    <Eye size={16} className="me-2" />
                    Visualisation
                  </button>
                </li>
                <li className="nav-item mb-2">
                  <button 
                    className={`nav-link w-100 text-start ${activeTab === 'analytics' ? 'active' : 'text-white'}`}
                    onClick={() => setActiveTab('analytics')}
                  >
                    <BarChart3 size={16} className="me-2" />
                    Analytiques
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          {/* Upload & Cleaning Tab */}
          {activeTab === 'upload' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Upload & Nettoyage CSV</h2>
                <button className="btn btn-outline-primary">
                  <Settings size={16} className="me-2" />
                  Paramètres
                </button>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        <Upload className="me-2" size={20} />
                        Télécharger un fichier CSV
                      </h5>
                      <div className="border-2 border-dashed border-primary rounded p-4 text-center mb-3">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="form-control mb-3"
                        />
                        <p className="text-muted mb-0">
                          Glissez-déposez votre fichier CSV ici ou cliquez pour sélectionner
                        </p>
                      </div>
                      
                      {uploadProgress > 0 && (
                        <div className="mb-3">
                          <div className="progress">
                            <div 
                              className="progress-bar" 
                              style={{width: `${uploadProgress}%`}}
                            >
                              {uploadProgress}%
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="d-grid gap-2">
                        <button className="btn btn-primary">
                          <RefreshCw size={16} className="me-2" />
                          Nettoyer le fichier
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Options de nettoyage</h5>
                      <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" id="duplicates" defaultChecked />
                        <label className="form-check-label" htmlFor="duplicates">
                          Supprimer les doublons
                        </label>
                      </div>
                      <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" id="missing" defaultChecked />
                        <label className="form-check-label" htmlFor="missing">
                          Traiter les valeurs manquantes
                        </label>
                      </div>
                      <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" id="outliers" defaultChecked />
                        <label className="form-check-label" htmlFor="outliers">
                          Détecter les valeurs aberrantes
                        </label>
                      </div>
                      <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" id="normalize" defaultChecked />
                        <label className="form-check-label" htmlFor="normalize">
                          Normaliser les données
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Historique des fichiers</h2>
                <div className="input-group" style={{width: '300px'}}>
                  <span className="input-group-text">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
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
                                    setCsvData(mockCsvData);
                                  }}
                                >
                                  <Eye size={14} />
                                </button>
                                <button className="btn btn-outline-success">
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
          )}

          {/* Viewer Tab */}
          {activeTab === 'viewer' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Visualisation des données</h2>
                <div className="btn-group">
                  <button className="btn btn-outline-primary active">
                    Données nettoyées
                  </button>
                  <button className="btn btn-outline-primary">
                    Données originales
                  </button>
                  <button className="btn btn-outline-primary">
                    Comparaison
                  </button>
                </div>
              </div>

              {selectedFile && (
                <div className="alert alert-info mb-3">
                  <FileCheck className="me-2" size={16} />
                  Fichier: <strong>{selectedFile.name}</strong> | 
                  Lignes: <strong>{selectedFile.rowsOriginal}</strong> | 
                  Nettoyé le: <strong>{selectedFile.uploadDate}</strong>
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
                          {csvData.length > 0 && Object.keys(csvData[0]).map(key => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value, i) => (
                              <td key={i}>{value}</td>
                            ))}
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
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        >
                          Précédent
                        </button>
                      </li>
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const page = i + 1;
                        return (
                          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        );
                      })}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        >
                          Suivant
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Analytiques</h2>
                <div className="btn-group">
                  <button className="btn btn-outline-primary">
                    <Calendar size={16} className="me-2" />
                    Cette semaine
                  </button>
                  <button className="btn btn-outline-primary">
                    Ce mois
                  </button>
                  <button className="btn btn-outline-primary">
                    Cette année
                  </button>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h1 className="text-primary">24</h1>
                      <p className="text-muted">Fichiers traités</p>
                      <small className="text-success">
                        <TrendingUp size={12} className="me-1" />
                        +12% ce mois
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h1 className="text-success">98.5%</h1>
                      <p className="text-muted">Taux de réussite</p>
                      <small className="text-success">
                        <TrendingUp size={12} className="me-1" />
                        +2.1% ce mois
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h1 className="text-warning">1.8s</h1>
                      <p className="text-muted">Temps moyen</p>
                      <small className="text-success">
                        <TrendingUp size={12} className="me-1" />
                        -0.3s ce mois
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h1 className="text-info">34.2 MB</h1>
                      <p className="text-muted">Données traitées</p>
                      <small className="text-success">
                        <TrendingUp size={12} className="me-1" />
                        +8.4 MB ce mois
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-header">
                      <h5>Activité des nettoyages</h5>
                    </div>
                    <div className="card-body">
                      <div className="text-center text-muted p-4">
                        <BarChart3 size={48} className="mb-3" />
                        <p>Graphique des statistiques de nettoyage</p>
                        <small>(Intégration avec une librairie de graphiques recommandée)</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-header">
                      <h5>Types de problèmes détectés</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>Doublons</span>
                          <span className="badge bg-primary">45%</span>
                        </div>
                        <div className="progress mt-1">
                          <div className="progress-bar" style={{width: '45%'}}></div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>Valeurs manquantes</span>
                          <span className="badge bg-warning">30%</span>
                        </div>
                        <div className="progress mt-1">
                          <div className="progress-bar bg-warning" style={{width: '30%'}}></div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>Valeurs aberrantes</span>
                          <span className="badge bg-danger">15%</span>
                        </div>
                        <div className="progress mt-1">
                          <div className="progress-bar bg-danger" style={{width: '15%'}}></div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>Format</span>
                          <span className="badge bg-success">10%</span>
                        </div>
                        <div className="progress mt-1">
                          <div className="progress-bar bg-success" style={{width: '10%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVDashboard;