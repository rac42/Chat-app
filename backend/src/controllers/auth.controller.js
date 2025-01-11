import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async(req,res) => {
    const {fullName, password, email} = req.body;
    try{

        if(!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required"});
        }

        if(password.length<6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long"});
        }

        const user = await User.findOne({email});

        if(user) return res.status(400).json({ message: "User with this email id already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

        }else {
            return res.status(400).json({ message: "Invalid user data"});
        }

    }catch(error) {
        console.log("Error in sign up controller", error.message);
        return res.send(500).json({message: "Internal server error"});
    }
};


export const login = (req,res) => {
    res.send("Signup route");
};


export const logout = (req,res) => {
    res.send("Signup route");
};