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
  searchAttrTypeEnum(params) {
    return axios.post('/api/rest/alert/attrenum/search', params);
  },
  saveAlertAttrEnum(params) {
    return axios.post('/api/rest/alert/attrenum/save', params);
  },
  deleteAttrType(id) {
    return axios.post('/api/rest/alert/attrtype/delete', { id: id });
  },
  deleteAttrTypeEnum(id) {
    return axios.post('/api/rest/alert/attrenum/delete', { id: id });
  }
};

export default attrtype;
