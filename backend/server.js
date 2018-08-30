

require("babel-polyfill");
const winston = require('winston');
const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/databaseInit')();
require('./startup/config')();
//require('./startup/validation')();

const port = process.env.PORT || 3000;
app.listen(port ,()=>winston.info(`Listening on port ${port}...`));