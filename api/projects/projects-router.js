// Write your "projects" router here!

const express = require('express');

const {
  validateProjectId,
  validateProject,
} = require('../middleware/middleware')

// You will need `Projects-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const Project = require('./projects-model')

const router = express.Router();

router.get('/', (req, res, next) => {
  Project.get()
    .then(p => {
      res.json(p)
    })
    .catch(next)
});

router.get('/:id', validateProjectId, (req, res) => {
  res.json(req.id)
});

router.post('/', validateProject, (req, res, next) => {
  const project = req.body
  Project.insert({ name: project.name, description: project.description })
    .then(newProject => {
      res.status(201).json(newProject)
    })
    .catch(next)
});

router.put('/:id', validateProjectId, validateProject, (req, res, next) => {
  Project.update(req.params.id, { 
    name: req.body.name, description: req.body.description 
  })
    .then(() => {
      return Project.get(req.params.id)
    })
    .then(project => {
      res.json(project)
    })
    .catch(next)
});

router.delete('/:id', validateProjectId, async (req, res, next) => {
  try {
    await Project.remove(req.params.id)
    res.json(req.id)
  } catch (err) {
    next(err)
  }
});

router.get('/:id/actions', validateProjectId, async (req, res, next) => {
  try {
    const result = await Project.getProjectActions(req.params.id)
    res.json(result)
  } catch (err) {
    next(err)
  }
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    customMessage: 'uhhhhhhhhh',
    err: err.message,
    stack: err.stack
  })
})

module.exports = router