import axios from '@/resources/api/http.js';

const topo = {
  getTopoById(id) {
    return axios.post('/api/rest/alert/topo/get', { id: id });
  },
  searchTopo(params) {
    return axios.post('/api/rest/alert/topo/search', params);
  },
  searchWidget(params) {
    return axios.post('/api/rest/alert/topo/widget/search', params);
  },
  saveTopo(params) {
    return axios.post('/api/rest/alert/topo/save', params);
  },
  getWidgetById(id) {
    return axios.post('/api/rest/alert/topo/widget/get', { id: id });
  },
  getWidgetByName(name) {
    return axios.post('/api/rest/alert/topo/widget/get', { name: name });
  },
  getWidgetListByType(type) {
    return axios.post('/api/rest/alert/topo/widget/list', { type: type });
  },
  saveWidget(params) {
    return axios.post('/api/rest/alert/topo/widget/save', params);
  },
  deleteWidget(id) {
    return axios.post('/api/rest/alert/topo/widget/delete', { id: id });
  },
  toggleWidgetActive(params) {
    return axios.post('/api/rest/alert/topo/widget/toggleactive', params);
  }
};

export default topo;
