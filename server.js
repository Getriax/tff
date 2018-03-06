const express = require('express'),
      bodyParser  = require('body-parser'),
      db = require('./services/database'),
      cors = require('cors'),

      config = require('./config/config'),
      router = require('./routes/routes'),

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
            console.log('Connected at port %s', config.port);
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