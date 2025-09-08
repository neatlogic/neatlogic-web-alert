import axios from '@/resources/api/http.js';

const alerttrash = {
  searchAlertTrash(params) {
    return axios.post('/api/rest/alerttrash/search', params);
  },
  getAlertTrashById(id) {
    return axios.post('/api/rest/alerttrash/get', { id: id });
  },
  rebuildIndex(id) {
    return axios.post('/api/rest/alerttrash/index/rebuild', { id: id });
  }
};

export default alerttrash;
