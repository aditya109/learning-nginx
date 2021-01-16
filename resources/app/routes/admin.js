const express = require('express');
const router = express.Router();

module.exports = () => {
        router.get('/', (req, res) => {
                return res.send(`appid:${process.env.APPID} ADMIN page: very few people should be able to see this !`);
        })

        return router;
}