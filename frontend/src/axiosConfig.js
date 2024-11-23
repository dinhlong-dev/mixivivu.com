import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: { 'Content-Type': 'application/json' }
});

instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    // gắn token vào header
    let persistAuth = window.localStorage.getItem('persist:auth');
    if (persistAuth) {
        let token = JSON.parse(persistAuth)?.token?.slice(1, -1);
        console.log("Token:", token);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // refresh token
    return response;
}, function (error) {
    return Promise.reject(error);
});



export default instance