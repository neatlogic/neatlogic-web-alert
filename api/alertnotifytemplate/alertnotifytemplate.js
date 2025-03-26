import axios from '@/resources/api/http.js';

const notifytemplate = {
  searchNotifyTemplate(params) {
    return axios.post('/api/rest/alert/notifytemplate/search', params || {});
  },
  getNotifyTemplateById(id) {
    return axios.post(`/api/rest/alert/notifytemplate/get`, { id: id });
  },
  saveNotifyTemplate(params) {
    return axios.post('/api/rest/alert/notifytemplate/save', params);
  },
  deleteNotifyTemplate(id) {
    return axios.post('/api/rest/alert/notifytemplate/delete', { id: id });
  }
};

export default notifytemplate;
