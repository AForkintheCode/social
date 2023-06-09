const router = require('express').Router();
const {
    getThoughts,
    getThoughtbyId,
    createThought,
    deleteThought,
    updateThought,
    addReaction,
    removeReaction,
} = require('../../controllers/thoughtController');

router.route('/').get(getThoughts).post(createThought);

// api/thoughts/:thoughtId
router.route('/:thoughtId').get(getThoughtbyId).put(updateThought).delete(deleteThought);

// api/users/:thoughtId/reaction/:reactionId
router.route('/:thoughtId/reaction').post(addReaction);

router.route('/:thoughtId/reaction/:reactionId').delete(removeReaction);

module.exports = router;