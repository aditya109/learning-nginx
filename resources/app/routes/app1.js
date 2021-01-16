const express = require('express');
const router = express.Router();

module.exports = () => {
        router.get('/', (req, res) => {
                res.send(`appid ${process.env.APPID}: app1 page: say hello!`);
        })
        return router;
}