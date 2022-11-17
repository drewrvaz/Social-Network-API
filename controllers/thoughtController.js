const { Thought, User } = require('../models');

const thoughtController = {
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .populate({ path: 'reactions', select: '-__v' })
      .select('-__v')
      .then((thoughtDB) => res.json(thoughtDB))
      .catch((err) => {
        console.log(err),  
        res.status(500).json(err)
      });
  },
  // get a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .populate({ path: 'reaction', select: '-__v' })
      .select('-__v')
      .then((thoughtDB) => {
        if (!thoughtDB) {
          res.status(404).json({ message: 'No thought with that ID' })
          return;
        }
        res.json(thoughtDB)
      })
      .catch((err) => res.status(500).json(err));
  },
  // create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thoughtDB) => res.json(thoughtDB))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, 
      { $set: req.body },
      { runValidators: true, new: true }
    )
    .populate({ path: 'reaction', select: '-__v' })
    .select('-__v')
    .then(thoughtDB => {
      if(!thoughtDB) {
        res.status(404).json({ message: 'No thought with that ID' })
        return;
      }
      res.json(thoughtDB)
    })
    .catch((err) => res.status(500).json(err));
  },
  // delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
    .then(thoughtDB => {
      if(!thoughtDB) {
        res.status(404).json({ message: 'No thought with that ID' })
        return;
      }
      res.json(thoughtDB)
    })
    .catch((err) => res.status(500).json(err));
  },
  // create a reaction
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: {reactions: req.params.body} },
      { runValidators: true, new: true }
    )
    .populate({ path: 'reaction', select: '-__v' })
    .select('-__v')
    .then(thoughtDB => {
      if(!thoughtDB) {
        res.status(404).json({ message: 'No thought with that ID' })
        return;
      }
      res.json(thoughtDB)
    })
    .catch((err) => res.status(500).json(err));
  },
  // delete a reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
    .then(thoughtDB => {
      if(!thoughtDB) {
        res.status(404).json({ message: 'No thought with that ID' })
        return;
      }
      res.json(thoughtDB)
    })
    .catch((err) => res.status(500).json(err));
  }
}

module.exports = thoughtController;