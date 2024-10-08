const { createHmac, randomBytes, hash } = require('node:crypto');
const mongoose = require('mongoose');
const { createUserToken } = require('../services/authentication');

const userSchema = new mongoose.Schema({
    profileImage: {
        type: String,
        default: '/default.jpg'

    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    salt: {
        type: String
    },
    is_online: {
        type: String,
        default: '0'
    },
    friends: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        }
    ],
    reqRec: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        }
    ],
    reqSent: [{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }]
}, {timestamp: true});

userSchema.pre('save', function (next){
    const user = this;

    if(!user.isModified('password')) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.pre('remove', async function (next){
    try{
        const affectedUsers = await User.find({
            $or: [
                { reqSent: this._id },
                { reqRec: this._id },
                { friends: this._id }
            ]
        });
        
        for(const user of affectedUsers){
            await user.updateOne({
                $pull: {
                     reqSent: this._id,
                     reqRec: this._id,
                     friends: this._id
                }
            })
        }

        next();
    }catch(err){
        console.log('error is hereerer');
        
        console.log(err.message);
        next();
        
    }
})

userSchema.static('matchPasswordAndGenerateToken', async function (email, password){
    const user = await this.findOne({email});

    if(!user) throw new Error('Incorrect Email/Password');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt).update(password).digest('hex');

    if(hashedPassword !== userProvidedHash) throw new Error('incorrect Email/Password');

    const token = createUserToken(user);

    console.log('match password generate');
    
    return token;
})


const User = new mongoose.model('users', userSchema);
module.exports = User;