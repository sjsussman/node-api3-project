const express = require('express');

const postRouter = require('./posts/postRouter')
const userRouter = require('./users/userRouter')

const server = express();

server.use(express.json())
server.use(logger)
server.use('/api/posts', postRouter)
server.use('/api/users', userRouter)

server.use('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`=${req.method} ${req.originalUrl}, ${new Date()}`)
  next();
}

// server.use((error ,req, res, next) => {
//   res.status(500).json({
//     message: error
//   })
// })

module.exports = server;
