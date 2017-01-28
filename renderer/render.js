'use strict';
const express = require('express');
const app = express();
const path = require('path');

app.use('/', express.static(path.join(__dirname, './static')));
app.get('/', (req, res) => {
  res.send('<canvas id="canvas" width="500" height="500" style="border:1px solid #000000;"></canvas><script src="main.js"></script>');
});

app.listen(8000, () => {
  console.log('listening on port 8000');
});
