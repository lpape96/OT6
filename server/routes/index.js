const router = require('express').Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');

router.use(morgan('combined'));

router.use(bodyParser.json());

router.use('/user', require('./userApi'));

router.use('*', (req, res) => {
  res.sendStatus(404);
});

module.exports = router;
