import axios from "axios";

const policyApi = axios.create({
  baseURL: "/policy-api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default policyApi;