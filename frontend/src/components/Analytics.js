import React from 'react';
import { Calendar, TrendingUp, BarChart3 } from 'lucide-react';

const CSVAnalytics = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Analytiques</h2>
        <div className="btn-group">
          <button className="btn btn-outline-primary">
            <Calendar size={16} className="me-2" />
            Cette semaine
          </button>
          <button className="btn btn-outline-primary">Ce mois</button>
          <button className="btn btn-outline-primary">Cette année</button>
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
                  <div className="progress-bar" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Valeurs manquantes</span>
                  <span className="badge bg-warning">30%</span>
                </div>
                <div className="progress mt-1">
                  <div className="progress-bar bg-warning" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Valeurs aberrantes</span>
                  <span className="badge bg-danger">15%</span>
                </div>
                <div className="progress mt-1">
                  <div className="progress-bar bg-danger" style={{ width: '15%' }}></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Format</span>
                  <span className="badge bg-success">10%</span>
                </div>
                <div className="progress mt-1">
                  <div className="progress-bar bg-success" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVAnalytics;