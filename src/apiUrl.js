const apiUrl = process.env.NODE_ENV === "development" ? 'http://localhost:5000/api/v1/' : 'https://api.anganwaditest.co.in/api/v1/';
// const apiUrl = process.env.NODE_ENV === "development" ? 'http://' + process.env.REACT_APP_SERVER_IP + ':5000/api/v1/' : 'https://api.anganwaditest.co.in/api/v1/';

export default apiUrl;