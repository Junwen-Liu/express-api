const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Track = mongoose.model('Track');

const router = express.Router();

//make sure all routers in this file will request the user signin.
router.use(requireAuth);

router.get('/tracks', async (req, res) =>{
    const tracks = await Track.find({userId: req.user._id});

    res.send(tracks);
});

router.post('/tracks', async(req, res) =>{
    const {name, locations} = req.body;

    if(!name || !locations){
        res.status(422).send({error: '需要提供路线名称和位置信息'});
    }

    try{
        const track = new Track({name, locations, userId: req.user._id});
        await track.save();
        res.send(track);
    }catch(err){
        res.status(422).send({error:err.message});
    }

})

module.exports = router;