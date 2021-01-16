const express = require('express');
const router = express.Router();

const app1Route = require('./app1');
const app2Route = require('./app2');
const adminRoute = require('./admin');

module.exports = () => {
        router.get('/', (req, res) => {
                res.send(`appid:${process.env.APPID} home page: say hello!`);
        })
        router.use('/app1', app1Route());
        router.use('/app2', app2Route());
        router.use('/admin', adminRoute());
        return router;
}