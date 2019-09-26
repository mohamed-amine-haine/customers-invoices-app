import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "./Config";
import Cache from "./Cache";

function logout() {
  Cache.clear();
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

function authenticate(credentials) {
  return axios
    .post(LOGIN_API, credentials)
    .then(response => response.data.token)
    .then(token => {
      window.localStorage.setItem("authToken", token);
      setAxiosToken(token);
      return true;
    });
}

function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

function setup() {
  const token = window.localStorage.getItem("authToken");

  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

function isAuthenticated() {
  const token = window.localStorage.getItem("authToken");

  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }
  return false;
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated
};
