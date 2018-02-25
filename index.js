const express = require('express')
const path = require("path");
const bodyParser = require('body-parser');
const graphParser = require(__dirname + '/libs/main');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('port', (process.env.PORT || 8000));

app.use(express.static(__dirname + '/public/sh-ui/'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/sh-ui/index.html'));
})

app.listen(app.get('port'), function () {
  console.log("Node app is running at http://localhost:" + app.get('port'));
})

app.get('/hello', (req, res) => {
  res.send({greeting: 'hello!'});
});

app.post('/post', (req, res) => {
    console.log(req);
    res.send(graphParser.main(req.body));
});
