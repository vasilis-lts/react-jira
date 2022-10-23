console.log('Web-app environment: ' + process.env.NODE_ENV)

export const BASE_URL =
  process.env.NODE_ENV === 'development' ?
    'http://localhost:5000' :
    'https://react-jira-backend-production.up.railway.app';