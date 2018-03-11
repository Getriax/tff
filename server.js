const express = require('express'),
      bodyParser  = require('body-parser'),
      db = require('./services/database'),
      cors = require('cors'),

      config = require('./config/config'),
      router = require('./routes/routes'),
      logger = require('./config/logger'),
      app = express();


class Server {
    constructor() {
        this.initMiddleware();
        this.initDatabse();
        this.initRoutes();
        this.startServer();
    }
    startServer() {
        app.listen(config.port, (err) => {
            logger.info('Connected at port ' + config.port);
        });
    }
    initMiddleware() {
        app.use(bodyParser.json());
        app.use(cors());
        app.use(bodyParser.urlencoded({extended: false}));
    }
    initRoutes() {
        router.load(app, 'controllers');
    }
    initDatabse() {
        db.open(() => {console.log('Connection with database up')});
    }
}

module.exports = new Server();