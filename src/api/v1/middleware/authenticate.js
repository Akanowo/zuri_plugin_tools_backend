const { default: axios } = require('axios');
const { BASE_URL } = require('../_helpers/core_api_details');

const authenticate = async (req, res, next) => {

  const {authorization} = req.headers;

  if(!authorization) {
    return res.status(401).json({
      status: false,
      message: 'missing authorization'
    })
  }

  const token = authorization.split(' ')[1];
  console.log('TOKEN:', token);
  let response;
  try {
    const endpoint = '/auth/verify-token';
    const config = {
      headers: {
        authorization: `Bearer ${token}`
      }
    }
    response = await (await axios.get(`${BASE_URL}${endpoint}`, config)).data;
  } catch (error) {
    console.log('Error occured while verifying token')
    return next(error);
  }

  if(response.status === 200) {
    console.log('TOKEN VERIFY RESPONSE: ', response)
    req.authorization = { user: response.data.user, token }
    next()
  }
};

module.exports = authenticate;