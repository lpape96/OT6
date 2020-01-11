const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('./logger');
const routes = require('./routes/index');
const WEB_CONFIG = require('./config/web');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(cors());
/*
app.use(express.static(path.join(__dirname, 'dist/RepriseOrdi')));
app.use('/', express.static(path.join(__dirname, 'dist/RepriseOrdi')));
*/
app.use('/api', routes);

const server = require('http').createServer(app);

server.listen(WEB_CONFIG.port, WEB_CONFIG.hostname);
logger.debug(`Listenning on port ${WEB_CONFIG.port} and hostname ${WEB_CONFIG.hostname}`);
