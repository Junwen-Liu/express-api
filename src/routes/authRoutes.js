const express = require('express');
const monggose = require('mongoose');
const User = monggose.model('User');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', async (req, res)=>{
    const {email, password} = req.body;

    try{
        const user = new User({email, password});
        await user.save();
        
        const token = jwt.sign({userId: user._id}, 'My_secret_key');
        res.send({token});
    }catch(err){
        return res.status(422).send(err.message);
    }
});

router.post('/signin', async (req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(422).send({error: '需要提供邮箱和密码'});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(422).send({error: '无效邮箱或密码'});
    }

    try{
        await user.comparePassword(password);
        const token = jwt.sign({userId: user._id}, 'My_secret_key');
        res.send({token});
    }catch(err){
        return res.status(422).send({error: '无效邮箱或密码'});
    }
    
});

module.exports = router;