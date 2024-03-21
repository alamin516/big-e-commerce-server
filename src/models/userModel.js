const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { defaultImagePath } = require("../secret");



const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'User name is missing'],
        trim: true, 
        minlength: [3, 'The length of user name can be maximum 3 characters'],
        maxlength: [31, 'The length of user name can be maximum 31 characters'],
    },
    email: {
        type: String,
        required: [true, 'User email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'User password is required'],
        trim: true, 
        minlength: [6, 'The length of password can be maximum 3 characters'],
        set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },
    image: {
        // type: Buffer,
        // contentType: String,
        // required: [true, 'Image is required'],
        type: String,
        default: defaultImagePath
    },
    address: {
        type: String,
        required: [true, 'User address is required'],
        minlength: [3, 'The length of address can be maximum 3 characters'],
    },
    phone: {
        type: String,
        required: [true, 'User address is required']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    },
}, {timestamps: true});

const User = model('Users', userSchema);

module.exports = User;


