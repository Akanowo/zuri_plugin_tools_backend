const uuid = require('uuid');
const { tools, userTools } = require('../_helpers/dummyData')
const { BASE_URL, collection_name } = require('../_helpers/core_api_details');
const { default: axios } = require('axios');

const toolsController = () => {

  const getTools = async (req, res, next) => {
    const { user_id, organization_id } = req.query;
    const { plugin } = req;

    // zuri core read api object
    const readObject = {
      plugin_id: plugin.id,
      organization_id,
      collection_name,
    }

    let tools = [];

    if (user_id) {
      const usersTools = userTools.filter((x) => x.user_id === user_id);
      return res.status(200).json({
        status: true,
        data: usersTools
      })
    }

    try {
      const endpoint = '/data/read'
      tools = await (await axios.get(`${BASE_URL}${endpoint}/${readObject.plugin_id}/${readObject.collection_name}/${readObject.organization_id}`)).data
    } catch (error) {
      return next(error);
    }

    if(tools.status === 200) {
      console.log(tools);
      return res.status(200).json({
        status: true,
        message: 'tools fetched successfully',
        data: tools.data
      })
    }

    return res.status(422).json({
      status: true,
      data: tools.message
    })
  }

  const getSingleTool = (req, res) => {
    const { id } = req.params;
    const tool = tools.find((x) => x.id === id);
    if (!tool) {
      return res.status(404).json({
        status: false,
        message: 'No tool found'
      })
    }

    return res.status(200).json({
      status: true,
      data: tool
    })
  }

  const addTool = (req, res) => {
    const { user_id, tool_id } = req.body;

    const tool = tools.find((x) => x.id === tool_id);

    if (tool) {
      const toolExists = userTools.find((x) => x.id === tool_id);
      if(toolExists) {
        return res.status(422).json({
          status: false,
          message: 'tool exists already'
        })
      }

      userTools.push({
        user_id,
        ...tool
      })

      return res.status(200).json({
        status: true,
        message: 'tool successfully added'
      })
    }

    return res.status(404).json({
      status: false,
      message: 'no tool found'
    })
  }

  const addTools = async (req, res, next) => {
    // post data to zuri core
    const { plugin, user } = req;

    const endpoint = '/data/write';
    const postData = {
      plugin_id: plugin.id,
      organization_id: req.body.organization_id,
      collection_name,
      bulk_write: true,
      filter: {  },
      payload: {
        tool_id: uuid.v4(),
        user_id: user.id,
        organization_id: req.body.organization_id,
        ...req.body
      }
    }

    let response;
    try {
      response = await (await axios.post(`${BASE_URL}${endpoint}`, postData)).data
    } catch (error) {
      return next(error);
    }

    return res.status(response.status).json({
      status: false,
      message: 'tools added successfully'
    })
  }

  const removeTool = (req, res) => {
    const { tool_id, user_id } = req.body;

    // check tool exists amongst user added tools
    const usersTools = userTools.filter((x) => x.user_id === user_id);
    if(usersTools.length !== 0) {
      // find the particular tool among the user's tools
      const toolExists = usersTools.find((x) => x.id === tool_id);
      if(toolExists) {
        // remove tool
        const toolIndex = usersTools.findIndex((x) => x.id === tool_id);
        usersTools.splice(toolIndex, 1);
        return res.status(200).json({
          status: true,
          data: usersTools
        })
      }
      return res.status(422).json({
        status: false,
        message: 'tool not found for user'
      });
    }

    return res.status(403).json({
      status: false,
      message: 'please add some tools first'
    })
  }

  return {
    getTools,
    getSingleTool,
    addTool,
    addTools,
    removeTool
  }
}

module.exports = toolsController()