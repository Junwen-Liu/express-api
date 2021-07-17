const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

userSchema.pre('save', function(next){
    const user = this;
    //if the password is not changed, then will continue on
    if(!user.isModified('password')){
        return next();
    }

    //the number specify how complex the salt we want to generate
    bcrypt.genSalt(10, (err, salt)=>{
        if(err){
            return next(err);
        }
        
        bcrypt.hash(user.password, salt, (err, hash)=>{
            if(err){
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

//to automate password checking process, we will attach a method to User model:
userSchema.methods.comparePassword = function(candidatepassword) {
    const user = this;

    return new Promise((resolve, reject)=>{
        bcrypt.compare(candidatepassword, user.password, (err, isMatch)=>{
            if(err){
                return reject(err);
            }

            if(!isMatch){
                return reject(false);
            }

            resolve(true);
        })
    })
}


mongoose.model('User', userSchema);