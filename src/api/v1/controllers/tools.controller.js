const uuid = require('uuid');
const { tools, userTools } = require('../_helpers/dummyData')
const { BASE_URL, collection_name, user_tools_collection } = require('../_helpers/core_api_details');
const { default: axios } = require('axios');

const toolsController = () => {

  const getTools = async (req, res, next) => {
    const { user_id } = req.query;
    const { plugin, organization } = req;

    console.log(plugin);

    // zuri core read api object
    const readObject = {
      plugin_id: plugin.id,
      organization_id: organization._id,
      collection_name,
    }

    let tools = [];

    if (user_id) {
      readObject.collection_name = user_tools_collection;
      readObject.filter = {user_id, plugin_id: plugin.id, organization_id: organization._id};
    }

    console.log(readObject);

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
    const { plugin, organization } = req;

    console.log(plugin);

    // zuri core read api object
    const readObject = {
      plugin_id: plugin.id,
      organization_id: organization._id,
      collection_name,
    }
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

  const addTool = async (req, res) => {
    const { plugin, organization } = req;
    const { user_id, tool_id } = req.body;

    const readObject = {
      plugin_id: plugin.id,
      organization_id: organization._id,
      collection_name,
      filter: { _id: tool_id }
    }

    // verify tool exists
    let toolExists;
    let endpoint = '/data/read'
    try {
      toolExists = await (await axios.post(`${BASE_URL}${endpoint}`), readObject).data
    } catch (error) {
      return next(error);
    }

    console.log(toolExists);

    if(toolExists.status === 200) {
      endpoint = '/data/write';
      readObject.collection_name = user_tools_collection;
      readObject.filter = {};
      readObject.payload = {
        user_id,
        tool_id,
        createdDate: new Date()
      }
    }

    return res.status(404).json({
      status: false,
      message: 'no tool found'
    })
  }

  const addTools = async (req, res, next) => {
    // post data to zuri core
    const { plugin, user, organization } = req;

    console.log(plugin)

    console.log(organization, user);

    const endpoint = '/data/write';
    const postData = {
      plugin_id: plugin.id,
      organization_id: organization._id,
      collection_name,
      bulk_write: req.body.bulk_write,
      filter: {},
      payload: req.body.data
    }

    console.log('POST_DATA: ',postData);

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