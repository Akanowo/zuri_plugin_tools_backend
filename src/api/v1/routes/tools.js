const router = require('express').Router();
const controller = require('../controllers/tools.controller');
const toolsValidator = require('../validators/tools.validator');

const routes = () => {
  const {
    getTools,
    addTool,
    addTools,
    getSingleTool
  } = controller;

  router.get('/get', getTools);
  router.get('/get/:id', getSingleTool);
  router.post('/add', addTool);
  router.post('/add/populate', toolsValidator, addTools)
  
  return router;
}

module.exports = routes;