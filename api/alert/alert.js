import axios from '@/resources/api/http.js';

const alert = {
  getAlertViewById(id) {
    return axios.post('/api/rest/alert/alert/view/get', { id: id });
  },
  getAlertViewByName(name) {
    return axios.post('/api/rest/alert/alert/view/get', { name: name });
  },
  searchAlert(params) {
    return axios.post('/api/rest/alert/alert/search', params);
  },
  listAlertAttrList(params) {
    return axios.post('/api/rest/alert/alert/attr/list', params);
  },
  saveAlertView(params) {
    return axios.post('/api/rest/alert/alert/view/save', params);
  },
  listAlertView(params) {
    return axios.post('/api/rest/alert/alert/view/list', params);
  },
  getAlertById(id) {
    return axios.post('/api/rest/alert/alert/get', { id: id });
  },
  getAlertOriginById(id) {
    return axios.post('/api/rest/alert/alertorigin/get', { id: id });
  }
};

export default alert;
