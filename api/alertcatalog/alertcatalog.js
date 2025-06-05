import axios from '@/resources/api/http.js';

const catalog = {
  getAlertCatalogById(id) {
    return axios.post('/api/rest/alert/catalog/get', { id: id });
  },
  listAlertCatalog() {
    return axios.post('/api/rest/alert/catalog/list');
  },
  saveAlertCatalog(params) {
    return axios.post('/api/rest/alert/catalog/save', params);
  },
  searchAlertCatalog(params) {
    return axios.post('/api/rest/alert/catalog/search', params);
  },
  updateAlertCatalogSort(params) {
    return axios.post('/api/rest/alert/catalog/sort/update', params);
  },
  updateAlertViewSort(params) {
    return axios.post('/api/rest/alert/view/sort/update', params);
  },
  deleteCatalogById(id) {
    return axios.post('/api/rest/alert/catalog/delete', { id: id });
  }
};

export default catalog;
