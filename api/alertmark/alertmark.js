import axios from '@/resources/api/http.js';

const alertmark = {
  getMarkByNameList(nameList) {
    return axios.post('/api/rest/alert/mark/list', { nameList: nameList || [] });
  },
  searchAlertMark(params) {
    return axios.post('/api/rest/alert/mark/search', params);
  },
  saveMark(params) {
    return axios.post('/api/rest/alert/mark/save', params);
  }
};

export default alertmark;
