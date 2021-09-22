const router = require('express').Router();
const AUTH = require('../middleware/authenticate');
const toolsRouter = require('./tools');
const getPluginDetails = require('../_helpers/getPluginDetails');

const routes = () => {
  router.use('/tools', AUTH, getPluginDetails, toolsRouter())

  return router;
}

module.exports = routes;