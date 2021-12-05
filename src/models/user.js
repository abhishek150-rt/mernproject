const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const studentSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isAlpha(value)) {
                throw new Error("Invalid name");
            }
        }
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isAlpha(value)) {
                throw new Error("Invalid name");
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        }
    },
    gender: {
        type: String,
        required: true
    },
    phone:
    {
        type: Number,
        unique: true,
        required: true
    },
    age: {
        type: Number, required: true
    },
    password: {
        type: String,
        required: true,
        // validate(value) {
        //     if (!validator.isStrongPassword(value)) {
        //         throw new Error("Invalid password");
        //     }
        // }
    },
    confirmpassword: {
        type: String,
        required: true,
        // validate(value) {
        //     if (!validator.isStrongPassword(value)) {
        //         throw new Error("Invalid password");
        //     }
        // }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
});

//Function for generating json web token for registartion
studentSchema.methods.generateToken = async function () {
    try {
        const registartionToken = await jwt.sign({ _id: this._id.toString()}, process.env.SECRET_KEY);
        this.tokens= this.tokens.concat({token:registartionToken});
        await this.save();
        return registartionToken;
    }
    catch (err) {
        console.log(err)
    }

}

//Fucntion for ecrypting password
studentSchema.pre("save", async function (next) {
    if (this.isModified("password")) {

        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword =await bcrypt.hash(this.confirmpassword, 10);
    }
    next()
})

const Student = new mongoose.model("Student", studentSchema);

module.exports = Student;