const { Thought, User } = require('../models');

module.exports = {
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => 
      console.log(err),  
      res.status(500).json(err));
  },
  // get a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'No thought with that ID' })
          return;
        }
        res.json(thought)
      })
      .catch((err) => res.status(500).json(err));
  },
  // create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
}