// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:9000';

const api = axios.create({
  baseURL: API_BASE_URL,

});

// Upload + Clean avec options de nettoyage
export const uploadAndClean = async (file,nomFile, onUploadProgress, options = {}) => {
  const formData = new FormData();
  formData.append('csvFile', file);
  formData.append('nomFile', nomFile);
    console.log(nomFile);



  // Ajouter dynamiquement les options booléennes
  Object.entries(options).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const response = await api.post('/clean/full', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob',
    onUploadProgress,
  });

  return response.data;
};

// Autres fonctions de gestion des fichiers (liste, détails, suppression)
export const getFiles = async () => {
  const response = await api.get('/api/files');
  return response.data;
};

export const getFile = async (fileName) => {
  const response = await api.get(`/files/${fileName}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const deleteFile = async (id) => {
  const response = await api.delete(`/api/files/${id}`);
  return response.data;
};

export default api;
