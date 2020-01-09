const express = require('express');
const routes = require('./routes/index');
const app = express();
const logger = require('./logger');
const cors = require('cors');
// const mongoose = require('mongoose');
// const db = require('./utils/db');
const WEB_CONFIG = require('./config/web');

//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
/*
app.use(express.static(path.join(__dirname, 'dist/RepriseOrdi')));
app.use('/', express.static(path.join(__dirname, 'dist/RepriseOrdi')));
*/
app.use(cors());
app.use('/api', routes);

const server = require('http').createServer(app);

server.listen(WEB_CONFIG.port, WEB_CONFIG.hostname);
logger.debug(`Listenning on port ${WEB_CONFIG.port} and hostname ${WEB_CONFIG.hostname}`);
