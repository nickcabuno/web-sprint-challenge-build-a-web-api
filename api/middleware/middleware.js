const Project = require('../projects/projects-model')
const Action = require('../actions/actions-model')

function logger(req, res, next) {
    const method = req.method
    const url = req.originalUrl
    console.log(`${method} ${url}`)
    next()
  }

async function validateProjectId(req, res, next) {
  try {
    const id = await Project.get(req.params.id)
    if (!id) {
        res.status(404).json({
            message: 'project not found',
          })
    } else {
      req.id = id
      next()
      }
      console.log(id)
    } catch (err) {
    res.status(500).json({
      message: "problem finding project",
    })
  }
}

function validateProject(req, res, next) {
  console.log(req.body)
  const something = req.body
  if (!something.name || !something.description) {
    res.status(400).json({
      message: 'missing required fields',
    })
  } else {
    req.project = something
    next()
  }
}


function validateAction(req, res, next) {
  const action = req.body
  if (!action.project_id || !action.description || !action.notes) {
    res.status(400).json({
      message: "missing required fields",
    })
  } else {
    req.action = action
    next()
  }
}

async function validateActionId(req, res, next) {
  try {
    const id = await Action.get(req.params.id)
    if (!id) {
        res.status(404).json({
            message: 'action not found',
          })
    } else {
      req.id = id
      next()
      }
      console.log(id)
    } catch (err) {
    res.status(500).json({
      message: "problem finding project",
    })
  }
}


module.exports = {
  validateProject,
  validateProjectId,
  validateAction,
  validateActionId,
  logger,
}