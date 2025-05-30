import axios from '@/resources/api/http.js';

const alertlevel = {
  listAlertLevel() {
    return axios.post('/api/rest/alert/level/list', {});
  },
  getAlertLevelById(id) {
    return axios.post('/api/rest/alert/level/get', { id: id });
  },
  getAlertLevelByLevel(level) {
    return axios.post('/api/rest/alert/level/get', { level: level });
  },
  saveAlertLevel(params) {
    return axios.post('/api/rest/alert/level/save', params);
  },
  deleteAlertLevel(id) {
    return axios.post('/api/rest/alert/level/delete', { id: id });
  }
};

export default alertlevel;
