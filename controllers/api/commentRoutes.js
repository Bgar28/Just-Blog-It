const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get all the comments 
router.get('/', async (req, res) => {
  try {
    const commentData = await Comment.findAll({});
    if (commentData.length === 0) {
      res
        .status(404)
        .json({ message: 'No comments found in the database!' });
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// find a comment by its id
router.get('/:id', async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      where: { id: req.params.id },
    });
    if (commentData.length === 0) {
      res
        .status(404)
        .json({ message: 'No comment found with this id' });
      return;
    }
    res.status(200).json(commentData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// allow a signed in user to create a new comment
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body, 
      user_id: req.session.user_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

// allow a signed in user to update their comment
router.put('/:id', withAuth, async (req, res) => {
  try {
    const updatedComment = await Comment.update(
      {
        description: req.body.description,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (!updatedComment) {
      res
        .status(404)
        .json({ message: 'No comment found with this id!' });
      return;
    }
    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

// allow a signed in user to delete their comment
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!commentData) {
      res.status(404).json({ message: 'Comment cannot be found by this id to be deleted!' });
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;