const winston = require('winston');

const { format } = winston;

const LOGGER_CONFIG = 'silly';

const logger = winston.createLogger({
  level: LOGGER_CONFIG,
  transports: [new winston.transports.Console()],
  format: format.combine(format.colorize({ all: true }), format.splat(), winston.format.simple()),
});

logger.stream = {
  /**
   * Stream the morgan logger to winston.
   *
   * @param message
   * @param encoding
   */
  write(message, encoding) {
    // eslint-disable-line no-unused-vars
    logger.info(message);
  },
};

module.exports = logger;
