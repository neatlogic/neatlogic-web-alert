import axios from '@/resources/api/http.js';

const attrtype = {
  searchAttrType(params) {
    return axios.post('/api/rest/alert/attrtype/search', params);
  },
  getAttrTypeById(id) {
    return axios.post('/api/rest/alert/attrtype/get', { id: id });
  },
  saveAttrType(params) {
    return axios.post('/api/rest/alert/attrtype/save', params);
  },
  deleteAttrType(id) {
    return axios.post('/api/rest/alert/attrtype/delete', { id: id });
  }
};

export default attrtype;
