require('./model/Track');
require('./model/User');
const express= require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireAuth = require('./middlewares/requireAuth');

const app = express();

//make sure use Parser before authRoutes, to make sure all json parsed first, then run request handler
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(authRoutes);
app.use(trackRoutes);

dotenv.config();

mongoose.connect(process.env.mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true
});
//when connect successfully
mongoose.connection.on('connected', ()=>{
    console.log('connected to mongo instance');
});
//when connect has some error
mongoose.connection.on('error', (err)=>{
    console.error('Error conneting to mongo', err);
})

//whenver use make this request, we first run the requireAuth middleware, if user provide valid token, then we allow user to access next handler.
app.get('/', requireAuth, (req, res)=>{
    res.send(`Your email: ${req.user.email}`);
});

app.listen(3000, ()=>{
    console.log('listening on port 3000');
});