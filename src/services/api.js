import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sua-api-aurealitera.com', 
});

export default api;