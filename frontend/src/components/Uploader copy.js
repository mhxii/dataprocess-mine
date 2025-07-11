import React, { useState } from 'react';
import { Upload, Settings, RefreshCw } from 'lucide-react';
import '../App.css';

const CSVUploader = ({ setFiles }) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
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

  return (
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
                      style={{ width: `${uploadProgress}%` }}
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
  );
};

export default CSVUploader;