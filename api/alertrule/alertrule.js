import axios from '@/resources/api/http.js';

const rule = {
  getAlertRuleById(id) {
    return axios.post('/api/rest/alert/rule/get', { id: id });
  },
  listAlertRule() {
    return axios.post('/api/rest/alert/rule/list', {});
  },
  saveAlertRule(params) {
    return axios.post('/api/rest/alert/rule/save', params);
  },
  testAlertRule(params) {
    return axios.post('/api/rest/alert/rule/test', params);
  },
  deleteAlertRule(id) {
    return axios.post('/api/rest/alert/rule/delete', { id: id });
  }
};

export default rule;
