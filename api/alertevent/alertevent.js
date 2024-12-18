import axios from '@/resources/api/http.js';

const alertevent = {
  listEventPlugin() {
    return axios.get('/api/rest/alert/event/plugin/list');
  },
  listAlertEvent() {
    return axios.get('/api/rest/alert/event/list');
  },
  listAlertEventHandler(params) {
    return axios.post('/api/rest/alert/event/handler/list', params);
  },
  getAlertEventHandlerById(id) {
    return axios.post('/api/rest/alert/event/handler/get', { id: id });
  },
  saveAlertEventHandler(params) {
    return axios.post('/api/rest/alert/event/handler/save', params);
  }
};

export default alertevent;
