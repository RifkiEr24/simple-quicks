import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:'https://dummyapi.io/data/v1/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'Application/json',
    'Access-Control-Allow-Origin': '*',
    'app-id': '6664237e8318491f5553e09a'
  },
});