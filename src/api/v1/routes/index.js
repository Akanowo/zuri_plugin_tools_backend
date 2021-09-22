const router = require('express').Router();
const AUTH = require('../middleware/authenticate');
const toolsRouter = require('./tools');
const getPluginDetails = require('../_helpers/getPluginDetails');
const getOrgDetails = require('../_helpers/getOrganizations');

const routes = () => {
  router.use('/tools', AUTH, getPluginDetails, getOrgDetails, toolsRouter())

  return router;
}

module.exports = routes;