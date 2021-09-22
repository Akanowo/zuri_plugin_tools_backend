const axios = require('axios').default;
const { BASE_URL } = require('../_helpers/core_api_details');

const getPluginDetails = async (req, res, next) => {
  const endpoint = '/marketplace/plugins'
  // get all plugins
  let plugins;
  try {
    plugins = await (await axios.get(`${BASE_URL}${endpoint}`)).data 
  } catch (error) {
    return next(error)
  }


  if(plugins.status === 200) {
    const external_tools = plugins.data.find((plugin) => plugin.name.toLowerCase() === 'external tools');
    if(external_tools){
      req.plugin = external_tools;
      next()
    }
  }
}

module.exports = getPluginDetails;