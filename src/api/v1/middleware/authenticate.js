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
  let response;
  try {
    const endpoint = '/auth/verify-token';
    const config = {
      authorization: `Bearer ${token}`
    }
    response = await (await axios.get(`${BASE_URL}${endpoint}`, config)).data;
  } catch (error) {
    return next(error);
  }

  if(response.status === 200) {
    req.user = response.data.user
    next()
  }
};

module.exports = authenticate;