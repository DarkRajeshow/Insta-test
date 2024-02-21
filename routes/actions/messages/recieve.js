import express from 'express';
import User from '../../../models/User.js';
import Message from '../../../models/Message.js';

const router = express.Router();

// Route for receiving a message
router.put('/receive', async (req, res) => {

    console.log(req.body);
    
    if (!req.isAuthenticated()) {
        return res.json({ success: false, status: "Login to continue." });
    }

    try {
        const loggedUserId = req.user._id;
        const { sender, content } = req.body;

        // Create a new message document
        const newMessage = new Message({
            content,
            sender,
            receiver: loggedUserId,
        });

        // Save the message
        await newMessage.save();

        // Update sender's sentMessages
        await User.findOneAndUpdate(
            { _id: sender, 'messages.userId': loggedUserId },
            { $push: { 'messages.$.conversation.sentMessages': newMessage._id } },
            { upsert: true }
        );

        // Update receiver's receivedMessages
        await User.findOneAndUpdate(
            { _id: loggedUserId, 'messages.userId': sender },
            { $push: { 'messages.$.conversation.receivedMessages': newMessage._id } },
            { upsert: true }
        );

        res.json({ success: true, status: "Message received successfully." });
    } 
    catch (error) {
        console.error(error);
        res.json({ success: false, status: "Something went wrong." });
    }
});

export default router;
