const express = require('express');
const { logger } = require('./middleware/middleware')
const server = express();
const projectsRouter = require('./projects/projects-router');
const actionsRouter = require('./actions/actions-router');

// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
// Do NOT `server.listen()` inside this file!

server.use(express.json());
server.use(logger)
server.use('/api/projects', projectsRouter)
server.use('/api/actions', actionsRouter)

// global middlewares and the user's router need to be connected here

server.get('/', (req, res) => {
  res.send(`<h2>here is a project or some actions or something running on a server :)</h2>`);
});

module.exports = server;
