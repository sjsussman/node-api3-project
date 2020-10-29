const express = require('express');

const Users = require('./userDb')
const Posts = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  const body = req.body
  Users.insert(body)
  .then(user => {
    console.log(body)
    res.status(201).json(user)
  })
  .catch(error => {
    console.log('You should not see this:', error)
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
const newPost = {user_id: req.params.id, text: req.body.text}
Posts.insert(newPost)
.then(post => {
  res.status(200).json(post)
})
.catch(err => {
  console.log(err)
  res.status(500).json({
    message: 'Could not post'
  })
})
});

router.get('/', (req, res) => {
  // do your magic!
  Users.get()
  .then(userData =>{
    res.status(200).json(userData);
    console.log(userData)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({
      message: 'Unable to retrieve user data'
    })
  })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params
  Users.getUserPosts(id)
  .then(posts => {
    if (posts) {
      res.status(200).json({data: posts})
    } else {
      res.status(400).json({
        message: 'Cannot find user posts'
      })
    }
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  Users.remove(id)
    .then(result => {
      if(result === 1) {
        res.status(200).json({id: id});
      } else {
        res.status(400).json({ message: `User with id ${id} does not exist`})
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "There was a server error deleting the user" })
    })
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;

  Users.update(id, req.body)
    .then(changes => {
      if (changes) {
        res.status(200).json({id: id});
      } else {
        res.status(400).json({ message: `User with id ${id} does not exist`});
      }
    })
    .catch(error => {
      console.log("hello", error);
      res.status(500).json({ message: "There was a server error updating the user" })
    })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  Users.getById(id)
  .then(user => {
    console.log('This is what your USER CRUD operation is returning:', user)
    if(user){
      req.user = user
      next()
    } else {
      res.status(404).json({
        message: `Error loading the post with id ${id}`
      })
    }
  })  
}

function validateUser(req, res, next) {
  // do your magic!'
  if (!req.body) {
    res.status(400).json({
      message: 'missing user data'
    })
  } else if (!req.body.name) {
    res.status(400).json({
      message: 'missing required name field'
    })
  } else {
    next()
  }
  
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({
      message: 'missing post data'
    })
  } else if (!req.body.text) {
    res.status(400).json({
      message: 'missing required text field'
    })
  } else {
    next()
  }
}

module.exports = router;
