import axios from "axios";

const policyApi = axios.create({
  baseURL: import.meta.env.VITE_POLICY_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default policyApi;