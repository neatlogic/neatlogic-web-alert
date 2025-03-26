import axios from '@/resources/api/http.js';

const status = {
  listAlertStatus() {
    return axios.post('/api/rest/alert/status/list', {});
  },
  saveAlertStatus(params) {
    return axios.post('/api/rest/alert/status/save', params);
  },
  getAlertStatusByName(name) {
    return axios.post('/api/rest/alert/status/get', {name: name});
  },
  deleteAlertStatus(name) {
    return axios.post('/api/rest/alert/status/delete', { name: name });
  }
};

export default status;
