// Write your "actions" router here!

const express = require('express');

const {
  validateActionId,
  validateAction,
} = require('../middleware/middleware')


const Action = require('./actions-model')

const router = express.Router();

router.get('/', (req, res, next) => {
  Action.get()
    .then(p => {
      res.json(p)
    })
    .catch(next)
});

router.get('/:id', validateActionId, (req, res) => {
  res.json(req.id)
});

router.post('/', validateAction, (req, res, next) => {
  Action.insert({ 
    project_id: req.body.project_id, 
    description: req.body.description,
    notes: req.body.notes,
})
    .then(newAction => {
      res.status(201).json(newAction)
    })
    .catch(next)
});

router.put('/:id', validateActionId, validateAction, (req, res, next) => {
  Action.update(req.params.id, { 
    project_id: req.body.project_id, 
    description: req.body.description,
    notes: req.body.notes,
  })
    .then(() => {
      return Action.get(req.params.id)
    })
    .then(Action => {
      res.json(Action)
    })
    .catch(next)
});

router.delete('/:id', validateActionId, async (req, res, next) => {
  try {
    await Action.remove(req.params.id)
    res.json(req.id)
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