const axios = require('axios').default;
const { BASE_URL } = require('../_helpers/core_api_details');

const getOrgDetails = async (req, res, next) => {
  const { token } = req.authorization;

  console.log('TOKEN:', token);

  const endpoint = '/organizations'
  // get all plugins
  let organizations;
  try {
    const config = {
      headers: {
        authorization: `Bearer ${token}`
      }
    }
    organizations = await (await axios.get(`${BASE_URL}${endpoint}`, config)).data 
  } catch (error) {
    return next(error)
  }


  if(organizations.status === 200) {
    req.organization = organizations.data[0];
    next();
  }
}

module.exports = getOrgDetails;