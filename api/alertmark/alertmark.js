import axios from '@/resources/api/http.js';

const alertmark = {
  getMarkByNameList(nameList) {
    return axios.post('/api/rest/alert/mark/list', { nameList: nameList });
  }
};

export default alertmark;
