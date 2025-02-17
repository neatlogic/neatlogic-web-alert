import axios from '@/resources/api/http.js';

const alert = {
  getAlertViewById(id) {
    return axios.post('/api/rest/alert/view/get', { id: id });
  },
  getAlertViewByName(name) {
    return axios.post('/api/rest/alert/view/get', { name: name });
  },
  searchAlert(params) {
    return axios.post('/api/rest/alert/search', params);
  },
  listAlertAttrList(params) {
    return axios.post('/api/rest/alert/attr/list', params);
  },
  saveAlertView(params) {
    return axios.post('/api/rest/alert/view/save', params);
  },
  listAlertView(params) {
    return axios.post('/api/rest/alert/view/list', params);
  },
  getAlertById(id) {
    return axios.post('/api/rest/alert/get', { id: id });
  },
  getAlertOriginById(id) {
    return axios.post('/api/rest/alert/alertorigin/get', { id: id });
  },
  handleAlert(params) {
    return axios.post('/api/rest/alert/handle', params);
  },
  searchAlertAudit(params) {
    return axios.post('/api/rest/alert/audit/search', params);
  },
  searchAlertEventAudit(params) {
    return axios.post('/api/rest/alert/event/audit/search', params);
  },
  searchAlertComment(params) {
    return axios.post('/api/rest/alert/comment/search', params);
  },
  deleteAlert(params) {
    return axios.post('/api/rest/alert/delete', params);
  },
  searchOriginalAlert(params) {
    return axios.post('/api/rest/alert/origin/search', params);
  },
  deleteAlertView(id) {
    return axios.post('/api/rest/alert/view/delete', { id: id });
  }
};

export default alert;
