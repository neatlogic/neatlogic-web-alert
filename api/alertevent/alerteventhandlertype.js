import axios from '@/resources/api/http.js';

const alerteventhandlertype = {
  searchAlertEventHandlerType(params) {
    return axios.post('/api/rest/alert/event/handler/type/search', params);
  },
  deleteAlertEventHandlerType(id) {
    return axios.post('/api/rest/alert/event/handler/type/delete', {id: id});
  },
  saveAlertEventHandlerType(params) {
    return axios.post('/api/rest/alert/event/handler/type/save', params);
  }
};

export default alerteventhandlertype;
