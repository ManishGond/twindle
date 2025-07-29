// utils/axios.ts
import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000/api", // or from env var
  withCredentials: true,
});
