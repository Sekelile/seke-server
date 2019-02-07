const express  = require('express');
const body_parser = require('body-parser')
const {server} = require('./server');
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(body_parser.json())
app.use(body_parser.raw({ type: 'application/vnd.custom-type' }))
const PORT = process.env.PORT || 3000;

http.listen(PORT, _=> {
    console.log(`Started server on port ${PORT}`)
})


server(app,io)

io.on('connection', function(socket){
    console.log('a user connected');
});