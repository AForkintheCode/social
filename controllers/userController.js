// ObjectId() method for converting userId string into an ObjectId for querying database
const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    //all users
    async getUsers (req, res) {
        try{
            const users = await User.find()
                .select('-__v')                           
            res.json(users);
        }catch(err){            
            return res.status(500).json(err);
        }
    },
    //single user
    async getUserbyId (req, res) {
        try{
            const user = await User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('friends')       
            .populate('thoughts')
    
          if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
          }
    
          res.json(user)
        }catch(err){
            console.log(err);
            return res.status(500).json(err);
        }
    },
    //create a user
    async createUser (req, res) {
        try{
            const user = await User.create(req.body);
            res.json(user);
        }catch(err){
            console.log(err);
            return res.status(500).json(err);
        }
    },

    //delete user
    async deleteUser (req, res) {
        try{
            const user = await User.findOneAndRemove({ _id: req.params.userId });
            
            if (!user) {
                return res.status(404).json({ message: 'No such user exists' });
              }

            await Thought.deleteMany({_id: {$in: user.thoughts} });
            res.json({ message: 'User successfully deleted' });
        }catch(err){
            console.log(err);
            return res.status(500).json(err);
        }
    },
    //update user
    async updateUser (req, res) {
        try{
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            {},
            { runValidators: true, new: true }
        );

        if (!user) {
            return res.status(404).json({message: 'No such user exists'})
        }
        }catch(err){
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async addFriend (req, res) {
        try{
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: {friends: req.params.friendId}},
            { new: true }
        );

        if (!user) {
            return res.status(404).json({message: 'No such user exists'})
        }
        }catch(err){
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async removeFriend (req, res) {
        try{
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: {friends: req.params.friendId}},
            { new: true }
        );

        if (!user) {
            return res.status(404).json({message: 'No such user exists'})
        }

        res.json(user);
        
        }catch(err){
            console.log(err);
            return res.status(500).json(err);
        }
    },

};