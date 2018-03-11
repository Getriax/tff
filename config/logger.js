const winston = require('winston');

const myCustomLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
    },
    colors: {
        info: 'green',
        error: 'red',
        warn: 'orange'
    }
};

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: `${__dirname}/../logs/error.log`, level: 'error', timestamp: true}),
        new winston.transports.File({ filename: `${__dirname}/../logs/info.log`, timestamp: true}),
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: `${__dirname}/../logs/exceptions.log` })
    ],
    exitOnError: false
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        handleExceptions: true,
        format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.simple()
        )
    }));
}
winston.addColors(myCustomLevels);
module.exports = logger;