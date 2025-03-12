import axios from '@/resources/api/http.js';

const alerttype = {
  searchAlertType(params) {
    return axios.post('/api/rest/alert/alerttype/search', params);
  },
  getAlertTypeById(id) {
    return axios.post('/api/rest/alert/alerttype/get', { id: id });
  },
  getAlertTypeByName(name) {
    return axios.post('/api/rest/alert/alerttype/get', { name: name });
  },
  saveAlertType(params) {
    return axios.post('/api/rest/alert/alerttype/save', params);
  },
  deleteAlertType(id) {
    return axios.post('/api/rest/alert/alerttype/delete', { id: id });
  }
};

export default alerttype;
