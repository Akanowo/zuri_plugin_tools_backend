
const handler = (err, req, res, next) => {
  console.log(err.name);

  if(err.response) { // axios request error
    console.log(err.reponse);
    return res.status(422).json({
      status: false,
      message: err.response.data.message || err.reponse.message
    })
  }

  switch (err.name) {
    case 'SyntaxError':
      return res.status(400).json({
        status: false,
        message: 'invalid syntax'
      })

    case 'TypeError':
      return res.status(400).json({
        message: 'invalid data'
      })

    default:
      return res.status(500).json({
        status: false,
        message: 'Unexpected error'
      })
  }

  }

  module.exports = handler