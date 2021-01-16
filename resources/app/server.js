const express = require('express');
const path = require('path');

let routes = require('./routes');

const app = express();
const port = 9999;

app.use('/', routes());

app.listen(port, () => {
        console.log(`Listening on port ${port}`);
})