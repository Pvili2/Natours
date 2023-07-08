const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
//We can write our own email validator, but there are many 3rd party libraries
/* function emailValidate(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}
 */
function passVal(pass) {
    return pass === this.password;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The user name is required']
    },
    email: {
        type: String,
        required: [true, 'The user emailis required'],
        unique: [true, 'This email address has already taken'],
        lowercase: true,
        validate: [validator.isEmail, 'The email syntax is invalid']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'The user password is required'],
        minlenght: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'The user repassword is required'],
        //ONLY WORKS IN SAVE (This is not gonna work with update)
        validate: [passVal, `The 2 password is not equal! (Invalid password: {VALUE})`]
    },
    passwordChangedAt: {
        type: Date
    }
})

//Only add next param, because otherwise the whole route is broken
userSchema.pre('save', async function (next) {
    //Check if the password field is modified, if not then we exit from this function
    if (!this.isModified('password')) {
        return next();
    }

    //hashing the password
    this.password = await bcrypt.hash(this.password, 12)

    // From here, we don't need repassword so we can delete this field value (In here we already throught the password validation)
    this.passwordConfirm = undefined;
    next();
})

//An instance method to the password validation 

//NOT WORKING
userSchema.methods.passwordCompare = async (hashPass, userPass) => {
    const auth = await bcrypt.compare(userPass, hashPass)

    return auth;
}
userSchema.methods.changedPasswordAfter = function (timestap) {

    if (this.passwordChangedAt) {
        return parseInt(this.passwordChangedAt.getTime() / 1000, 10) > timestap;
    }
    //the password is not changed since the jwt token
    return false;
}
const User = mongoose.model('User', userSchema)

module.exports = User;