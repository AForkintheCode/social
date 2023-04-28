const { Schema, model} = require('mongoose');
const dateFormat = require('../utils/dateFormat');
const reactionSchema = require('./Reaction.js');

const thoughtSchema = new Schema(
{
    thoughtText: {
        type: String,
        required: true,
        min_length: 1,
        max_length: 280
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        get: timestamp => dateFormat(timestamp)
    },
    username: {
        type: String,
    },
    reactions: [reactionSchema],
},
{
    toJSON: {            
        virtuals: true,
    }
}
);

thoughtSchema
    .virtual('reactionCount').get(function() {
        return this.reactions.length;
})

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;