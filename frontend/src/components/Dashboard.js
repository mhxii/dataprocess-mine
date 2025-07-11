import React, { useState } from 'react';
import {
  Upload, Eye, History, BarChart3, Database, Settings
} from 'lucide-react';
import CSVUploader from './Uploader';
import CSVHistory from './History';
import CSVViewer from './Viewer';
import CSVAnalytics from './Analytics';

const CSVDashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [files, setFiles] = useState([]); // même tableau initial
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvData, setCsvData] = useState([]);

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
                  <button className={`nav-link w-100 text-start ${activeTab === 'upload' ? 'active' : 'text-white'}`} onClick={() => setActiveTab('upload')}>
                    <Upload size={16} className="me-2" />
                    Upload & Nettoyage
                  </button>
                </li>
                <li className="nav-item mb-2">
                  <button className={`nav-link w-100 text-start ${activeTab === 'history' ? 'active' : 'text-white'}`} onClick={() => setActiveTab('history')}>
                    <History size={16} className="me-2" />
                    Historique
                  </button>
                </li>
                <li className="nav-item mb-2">
                  <button className={`nav-link w-100 text-start ${activeTab === 'viewer' ? 'active' : 'text-white'}`} onClick={() => setActiveTab('viewer')}>
                    <Eye size={16} className="me-2" />
                    Visualisation
                  </button>
                </li>
                <li className="nav-item mb-2">
                  <button className={`nav-link w-100 text-start ${activeTab === 'analytics' ? 'active' : 'text-white'}`} onClick={() => setActiveTab('analytics')}>
                    <BarChart3 size={16} className="me-2" />
                    Analytiques
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="col-md-9 col-lg-10 p-4">
          {activeTab === 'upload' && (
            <CSVUploader setFiles={setFiles} />
          )}
          {activeTab === 'history' && (
            <CSVHistory
              files={files}
              setActiveTab={setActiveTab}
              setSelectedFile={setSelectedFile}
              setCsvData={setCsvData}
            />
          )}
          {activeTab === 'viewer' && (
            <CSVViewer
              selectedFile={selectedFile}
              csvData={csvData}
            />
          )}
          {activeTab === 'analytics' && (
            <CSVAnalytics />
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVDashboard;
