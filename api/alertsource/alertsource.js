import axios from '@/resources/api/http.js';

const source = {
  searchAlertSource(params) {
    return axios.post('/api/rest/alert/source/search', params);
  },
  getAlertSourceByName(name) {
    return axios.post('/api/rest/alert/source/get', { name: name });
  },
  saveAlertSource(params) {
    return axios.post('/api/rest/alert/source/save', params);
  },
  deleteAlertSourceByName(name) {
    return axios.post('/api/rest/alert/source/delete', { name: name });
  }
};

export default source;
