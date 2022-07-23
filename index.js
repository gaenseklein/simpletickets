//dependencias
const express = require('express');
const app = express();
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

//Import routes
const auth = require('./routes/auth');
const front = require('./routes/front')
const loginRoute = require('./routes/login');
const ticket = require('./routes/ticket')
const userRoute = require('./routes/user');
// const public = require('./routes/public');

//implementa simpletickets:
const simpletickets = require('./simpletickets.js');
simpletickets.init();

//Route Middlewares
// app.use(express.json({limit: '50mb'}));

app.use('/login',express.urlencoded({extended:false}),loginRoute);
app.use('/user',auth, express.urlencoded({extended:true}),userRoute);
// app.use('/user', express.urlencoded({extended:true}),userRoute);

//serving static-files for test-purpose / can be served directly by nginx
app.use('/files', auth, express.static('./private/files'));
app.use('/public', express.static('./public'));
app.use('/ticket', auth,express.urlencoded({extended:false}), ticket)
app.use('/',front)


//start listening server
app.listen(6969,() => console.log('server up and running on port 6969'));
