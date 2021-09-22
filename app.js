const express = require('express');
const cors = require('cors');
const v1Api = require('./src/api/v1/routes');
const errorHandler = require('./src/api/v1/_helpers/errorHandler')

const app = express();

const PORT = process.env.PORT || 3000;

// app configs
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
// routes
app.get('/', (req, res) => {
  return res.status(200).json({
    status: true,
    message: 'INDEX ROUTE'
  })
})
app.use('/api/v1', v1Api());

app.use('**', (req, res) => {
  return res.status(404).json({
    status: false,
    error: 'NOT FOUND'
  })
})

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App started on port: ${PORT}`);
})