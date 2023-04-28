const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

module.exports = {

    //get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find()   
                .sort({createdAt: -1});
                       
            res.json(thoughts);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    //get one thought
    async getThoughtbyId(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }
            res.json(thought)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    //create thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body)

            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'Thought created but no user with this id' });
            }

            res.json({ message: 'Thought successfully formed!' });

        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    //update thought
    async updateThought(req, res) {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true });

        if (!thought) {
            return res.status(404).json({ message: 'No thought found!' });
        }
    },

    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId })

            if (!thought) {
                return res.status(404).json({ message: 'No thought found!' });
            }

            const user = User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found!' });
            }

            res.json({ message: 'Thought deleted!' });
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

    async addReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found!' });
            }

            res.json(thought);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

    async removeReaction(req, res) {
        try {
            const thought = await Thought.findOneAndRemove(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found!' });
            }
            res.json(thought);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },
};



