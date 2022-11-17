const { User } = require('../models');

const userController = {
  // get all users
  getAllUsers(req, res) {
    User.find()
    // populate user thoughts
    .populate({ path: 'thoughts', select: '-__v' })
    // populate user friends
    .populate({ path: 'friends', select: '-__v' })
    .select('-__v')
    .then((userDB) => res.json(userDB))
    .catch((err) => {
      console.log(err),  
      res.status(500).json(err)
    });
  },
  // get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
    // populate user thoughts
    .populate({ path: 'thoughts', select: '-__v' })
    // populate user friends
    .populate({ path: 'friends', select: '-__v' })
    .select('-__v')
    .then((userDB) => {
      if (!userDB) {
        res.status(404).json({ message: 'No user with that ID' })
        return;
      }
      res.json(userDB)
    })
    .catch((err) => res.status(500).json(err));
  },
  // create new user
  createUser(req, res) {
    User.create(req.body)
    .then((userDB) => res.json(userDB))
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
  },
  // update user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId }, 
      { $set: req.body },
      { runValidators: true, new: true }
    )
    .then(userDB => {
      if(!userDB) {
        res.status(404).json({ message: 'No user with that ID' })
        return;
      }
      res.json(userDB)
    })
    .catch((err) => res.status(500).json(err));
  },
  // delete user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
    .then(userDB => {
      if(!userDB) {
        res.status(404).json({ message: 'No user with that ID' })
        return;
      }
      res.json(userDB)
    })
    .catch((err) => res.status(500).json(err));
  },
  // add a friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: {friends: req.params.friendId} },
      { runValidators: true, new: true }
    )
    // populate user friends
    .populate({ path: 'friends', select: '-__v' })
    .select('-__v')
    .then(userDB => {
      if(!userDB) {
        res.status(404).json({ message: 'No user with that ID' })
        return;
      }
      res.json(userDB)
    })
    .catch((err) => res.status(500).json(err));
  },
  // remove a friend
  removeFriend(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
    // populate user friends
    .populate({ path: 'friends', select: '-__v' })
    .select('-__v')
    .then(userDB => {
      if(!userDB) {
        res.status(404).json({ message: 'No user with that ID' })
        return;
      }
      res.json(userDB)
    })
    .catch((err) => res.status(500).json(err));
  }
}

module.exports = userController;