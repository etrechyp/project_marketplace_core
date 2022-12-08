const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/db.config");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerConf = require("../swagger.conf")

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.paths = {
            users: "/api/user",
            auth: "/api/auth",
            products: "/api/product",
            categories: "/api/category"
        };

        this.database();
        this.middlewares();
        this.routes();
    }

    async database() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors({
            credentials: false,
        }));
        this.app.use(express.json());
        this.app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerConf)))
    }

    routes() {
        this.app.use(this.paths.auth, require("../routes/auth.routes"));
        this.app.use(this.paths.users, require("../routes/user.routes"));
        this.app.use(this.paths.products, require("../routes/product.routes"));
        this.app.use(this.paths.categories, require("../routes/category.routes"));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server run in port ${this.port}`);
        });
    }
}

module.exports = Server;