const express = require('express');

const Posts = require('./postDb')

const router = express.Router();

router.get('/', (req, res) => {
  // do your magic!
  Posts.get()
  .then(posts =>{
    res.status(200).json(posts);
    console.log(posts)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({
      message: 'Unable to retrieve posts'
    })
  })
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
  // Posts.getById(req.params.id)
  // .then((post) =>{
  //   res.status(200).json(post);
  // })
  // .catch((error) => {
  //   console.log(error)
  //   res.status(500).json({
  //     message: 'Unable to Post'
  //   })
  // })
  res.status(200).json(req.post)
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  Posts.remove(req.params.id)
  .then(post => {
    console.log(post)
    res.status(200).json({
      message: 'The post has been deleted'
    })
  })
  // .then((postCount) => {
  //   if(postCount > 0) {
  //     console.log(postCount)
  //     res.status(200).json({
  //       message: 'The post has been deleted'
  //     })
  //   } else {
  //     console.log(postCount)
  //     res.status(404).json({
  //       message: 'The post could not be found'
  //     })
  //   }
  // })
  // .catch((err) =>{
  //   console.log(err)
  //   res.status(500).json({ 
  //     message: 'Error deleting the post please try again'
  //   })
  // })
});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
  Posts.update(req.params.id, req.body)
  .then(post => {
    console.log(post)
    res.status(200).json({
      message: 'You updated the post!'
    })
  })
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  Posts.getById(id)
  .then(post => {
    console.log('This is what your CRUD operation is returning:', post)
    if(post){
      req.post = post
      next()
    } else {
      res.status(404).json({
        message: `Error loading the post with id ${id}`
      })
    }
  })  
}

module.exports = router;
