import axios from "axios";

export let axiosInstance=axios.create({
  headers:{
    authorization:`Bearer ${localStorage.getItem('token')}`
  }
});