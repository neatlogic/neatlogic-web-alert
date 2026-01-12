import axios from '@/resources/api/http.js';

const action = {
  searchAction(params) {
    return axios.post('/api/rest/alert/action/search', params);
  },
  saveAction(params) {
    return axios.post('/api/rest/alert/action/save', params);
  },
  getActionById(id) {
    return axios.post('/api/rest/alert/action/get', { id: id });
  }
};

export default action;
