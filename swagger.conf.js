const path = require("path")

const swaggerConf = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Project Marketplace Core API",
            version: "1.0.0"
        },
        servers: [
            {
                url: "https://pmc-cloud.tk"
            }
        ]
    },
    apis: [`${path.join(__dirname, "./routes/*.js")}`]
}

module.exports = swaggerConf;