import axios from '@/resources/api/http.js';

const alertevent = {
  listEventPlugin(params) {
    return axios.post('/api/rest/alert/event/plugin/list', params);
  },
  listAlertEvent() {
    return axios.get('/api/rest/alert/event/list');
  },
  listAlertEventHandler(params) {
    return axios.post('/api/rest/alert/event/handler/list', params);
  },
  updateAlertEventHandlerSort(params) {
    return axios.post('/api/rest/alert/event/sort/update', params);
  },
  getAlertEventHandlerById(id) {
    return axios.post('/api/rest/alert/event/handler/get', { id: id });
  },
  getAlertEventPluginByName(name) {
    return axios.post('/api/rest/alert/event/plugin/get', { name: name });
  },
  saveAlertEventHandler(params) {
    return axios.post('/api/rest/alert/event/handler/save', params);
  },
  saveAlertEventPluginConfig(params) {
    return axios.post('/api/rest/alert/event/plugin/config/save', params);
  },
  deleteAlertEventHandler(id) {
    return axios.post('/api/rest/alert/event/handler/delete', { id: id });
  }
};

export default alertevent;
