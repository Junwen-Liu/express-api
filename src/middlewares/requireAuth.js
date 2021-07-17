const jwt = require('jsonwebtoken');
const monggose = require('mongoose');
const User = monggose.model('User');

module.exports = (req, res, next) =>{
    const {authorization} = req.headers;
    //authorization = 'Bearer laskj....'

    if(!authorization){
        return res.status(401).send({error: 'you must be logged in'});
    }

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, 'My_secret_key', async(err, payload)=>{
        if(err){
            return res.status(401).send({error: 'you must be logged in'});
        }

        const {userId} = payload;

        const user = await User.findById(userId);

        //we will assign the user directly to req property, so that other page can use it from req.
        req.user = user;
        next();
    })
}