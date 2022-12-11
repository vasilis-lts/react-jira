console.log('Web-app environment: ' + process.env.NODE_ENV)

export const BASE_URL = process.env.REACT_APP_ENV === "dev" ? 'http://localhost:5000' : 'https://backend.softnet.com.gr'
