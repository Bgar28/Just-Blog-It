const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get all the posts created by the user
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      attributes: ['id', 'title', 'content', 'date_created'],
      order: [['date_created']],
      include: [
        { model: User, attributes: ['username'] },
        {
          model: Comment,
          attributes: [
            'id',
            'description',
            'post_id',
            'user_id',
          ],
          include: { model: User, attributes: ['username'] },
        },
      ],
    });
    res.status(200).json(postData.reverse());
  } catch (err) {
    res.status(400).json(err);
  }
});

// get a specific post by its id
router.get('/:id', async (req, res) => {
  try {
    const postData = await Post.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'title', 'content', 'date_created'],
      order: [['date_created']],
      include: [
        { model: User, attributes: ['username'] },
        {
          model: Comment,
          attributes: [
            'id',
            'description',
            'post_id',
            'user_id',
          ],
          include: { model: User, attributes: ['username'] },
        },
      ],
    });
    if (!postData) {
      res.status(404).json({ message: "No posts found with this id!" });
      return;
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// allow a signed in user to create a new post
router.post('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(postData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// update a post by its id
router.put('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    res.json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a specific post by its id
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    if (!postData) {
      res.status(404).json({
        message: 'No post found with this id',
      });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;