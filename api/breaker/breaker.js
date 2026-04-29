import axios from '@/resources/api/http.js';

const breaker = {
  listHandler() {
    return axios.post('/api/rest/alert/breaker/handler/list');
  },
  searchPolicy(params) {
    return axios.post('/api/rest/alert/breaker/policy/search', params);
  },
  getPolicy(id) {
    return axios.post('/api/rest/alert/breaker/policy/get', { id: id });
  },
  savePolicy(params) {
    return axios.post('/api/rest/alert/breaker/policy/save', params);
  },
  deletePolicy(id) {
    return axios.post('/api/rest/alert/breaker/policy/delete', { id: id });
  },
  searchState(params) {
    return axios.post('/api/rest/alert/breaker/state/search', params);
  },
  searchAudit(params) {
    return axios.post('/api/rest/alert/breaker/audit/search', params);
  }
};

export default breaker;
