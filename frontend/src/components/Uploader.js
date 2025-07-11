// CSVUploader.js
import React, { useState } from 'react';
import { Upload, RefreshCw, Settings, Download, FileText } from 'lucide-react';
import { uploadAndClean } from '../services/api';

const CSVUploader = ({ setFiles }) => {
  const [cleaningOptions, setCleaningOptions] = useState({
    duplicates: true,
    missing: true,
    outliers: true,
    normalize: true,
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [logContent, setLogContent] = useState(null);
  const [zipBlobUrl, setZipBlobUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleOptionChange = (e) => {
    const { id, checked } = e.target;
    setCleaningOptions((prev) => ({ ...prev, [id]: checked }));
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file || null);
    setUploadProgress(0);
    setLogContent(null);
    setZipBlobUrl(null);
  };

  const handleClean = async () => {
    if (!selectedFile) return;

    try {
      setUploadProgress(0);
      setLogContent("Nettoyage en cours...");
      setZipBlobUrl(null);

      const data = await uploadAndClean(
        selectedFile,selectedFile.name,
        (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
        cleaningOptions
      );

      const zipBlob = new Blob([data], { type: 'application/zip' });
      const blobUrl = URL.createObjectURL(zipBlob);
      setZipBlobUrl(blobUrl);

      setLogContent("✅ Nettoyage terminé avec succès. Voir le fichier log dans le zip.");

      setFiles((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: selectedFile.name,
          originalSize: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
          cleanedSize: '-',
          status: 'completed',
          uploadDate: new Date().toLocaleString(),
          cleaningTime: '-',
          rowsOriginal: '-',
          rowsCleaned: '-',
          issues: [],
        },
      ]);
    } catch (error) {
      console.error('Erreur lors du nettoyage :', error);
      setLogContent("❌ Erreur lors du nettoyage. Voir la console.");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Upload & Nettoyage CSV</h2>
        <button className="btn btn-outline-primary">
          <Settings size={16} className="me-2" /> Paramètres
        </button>
      </div>

      <div className="row">
        {/* Upload Card */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">
                <Upload className="me-2" size={20} /> Télécharger un fichier CSV
              </h5>

              <div className="border-2 border-dashed border-primary rounded p-4 text-center mb-3">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="form-control mb-3"
                />
                <p className="text-muted mb-0">
                  Glissez-déposez votre fichier CSV ici ou cliquez pour sélectionner
                </p>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="progress mb-3">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style={{ width: `${uploadProgress}%` }}
                    aria-valuenow={uploadProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {uploadProgress}%
                  </div>
                </div>
              )}

              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleClean}
                  disabled={!selectedFile}
                >
                  <RefreshCw size={16} className="me-2" /> Nettoyer le fichier
                </button>
              </div>

              {zipBlobUrl && (
                <div className="alert alert-success mt-3 d-flex align-items-center">
                  <Download size={16} className="me-2" />
                  <a
                    href={zipBlobUrl}
                    download="cleaned_csv.zip"
                    className="btn btn-success btn-sm"
                  >
                    Télécharger le fichier nettoyé
                  </a>
                </div>
              )}

              {logContent && (
                <div className="alert alert-info mt-3 d-flex align-items-center">
                  <FileText size={16} className="me-2" />
                  <span>{logContent}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cleaning Options */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Options de nettoyage</h5>
              {[
                { id: 'duplicates', label: 'Supprimer les doublons' },
                { id: 'missing', label: 'Traiter les valeurs manquantes' },
                { id: 'outliers', label: 'Détecter les valeurs aberrantes' },
                { id: 'normalize', label: 'Normaliser les données' },
              ].map(({ id, label }) => (
                <div className="form-check mb-2" key={id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={id}
                    checked={cleaningOptions[id]}
                    onChange={handleOptionChange}
                  />
                  <label className="form-check-label" htmlFor={id}>
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVUploader;
