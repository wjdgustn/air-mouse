const express = require('express');

const app = express.Router();

app.post('/kill_server', (req, res, next) => {
    res.send('success');
    process.exit(0);
    return;
});

module.exports = app;