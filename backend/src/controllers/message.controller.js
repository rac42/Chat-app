import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReciverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async(req, res)=> {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    }catch(error) {
        console.log("Error in getUsersForSidebar function", error.message);
        res.status(500).json({message:"Internal server error"});
    }
};

export const getMessages = async(req, res)=> {
    try{
        const {id: userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId: myId, reciverId: userToChatId},
                {senderId: userToChatId, reciverId: myId}
            ]
        });

        res.status(200).json(messages);

    }catch(error) {
        console.log("Error in getting chat history", error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const sendMessage = async(req,res)=> {
    try{
        const {text, image} = req.body;
        // console.log(text);
        const {id: reciverId} = req.params; // renaming the id to reciver id for better understanding
        const senderId = req.user._id;

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            reciverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        const reciverSocketId = getReciverSocketId(reciverId);

        if(reciverId) {
            io.to(reciverSocketId).emit("newMessage", newMessage);
        }


        res.status(201).json(newMessage);

    }catch(error) {
        console.log("Error in sending message", error.message);
        res.status(500).json({message:"Internal server error"});
    }
};