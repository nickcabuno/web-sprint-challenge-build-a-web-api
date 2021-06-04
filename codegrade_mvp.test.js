// 👉 You can run these tests in your terminal by executing `npm test`
const request = require('supertest')
const db = require('./data/dbConfig')
const Action = require('./api/actions/actions-model')
const Project = require('./api/projects/projects-model')
const server = require('./api/server')

const projectA = {
  name: 'a', description: 'b', completed: false,
}
const projectB = {
  name: 'c', description: 'd', completed: true,
}
const actionA = {
  project_id: 1, description: 'x', notes: 'y', completed: false,
}
const actionB = {
  project_id: 1, description: 'u', notes: 'v', completed: true,
}
const actions = [actionA, actionB]

beforeAll(async () => {
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('actions').truncate()
  await db('projects').truncate()
  await db('projects').insert(projectA)
  await db('projects').insert(projectB)
  await db('actions').insert(actionA)
  await db('actions').insert(actionB)
})
afterAll(async (done) => {
  await db.destroy()
  done()
})

test('[0] sanity check', () => {
  expect(true).not.toBe(false)
})

describe('server.js', () => {
  // 👉 PROJECTS
  // 👉 PROJECTS
  // 👉 PROJECTS
  describe('projects endpoints', () => {
    describe('[GET] /api/projects', () => {
      test('[1] sends back all projects that exist', async () => {
        const res = await request(server).get('/api/projects')
        expect(res.body).toHaveLength(2)
        expect(res.body[0]).toMatchObject(projectA)
        expect(res.body[1]).toMatchObject(projectB)
      })
      test('[2] sends back empty array if no projects', async () => {
        await db('projects').truncate()
        const res = await request(server).get('/api/projects')
        expect(res.body).toHaveLength(0)
      })
    })
    describe('[GET] /api/projects/:id', () => {
      test('[3] sends back the project with given id', async () => {
        const res1 = await request(server).get('/api/projects/1')
        const res2 = await request(server).get('/api/projects/2')
        expect(res1.body).toMatchObject(projectA)
        expect(res2.body).toMatchObject(projectB)
      }, )
      test('[4] responds with a 404 if no project with given id', async () => {
        const res = await request(server).get('/api/projects/11')
        expect(res.status).toBe(404)
      }, )
    })
    describe('[POST] /api/projects', () => {
      test('[5] responds with the newly created project', async () => {
        const projectNew = { name: 'e', description: 'f', completed: true }
        const res = await request(server).post('/api/projects').send(projectNew)
        expect(res.body).toMatchObject(projectNew)
      }, )
      test('[6] inserts a new project into projects table', async () => {
        const projectNew = { name: 'e', description: 'f', completed: true }
        await request(server).post('/api/projects').send(projectNew)
        const project = await Project.get(3)
        expect(project).toMatchObject(projectNew)
      }, )
      test('[7] responds with a 400 if the request body is missing required fields', async () => {
        const projectNew = { name: 'e' }
        const res = await request(server).post('/api/projects').send(projectNew)
        expect(res.status).toBe(400)
      }, )
    })
    describe('[PUT] /api/projects/:id', () => {
      test('[8] responds with the updated project', async () => {
        const changes = { ...projectA, completed: true }
        const res = await request(server).put('/api/projects/1').send(changes)
        expect(res.body).toMatchObject(changes)
      }, )
      test('[9] updates the project in the projects table', async () => {
        const changes = { ...projectA, completed: true }
        await request(server).put('/api/projects/1').send(changes)
        const project = await Project.get(1)
        expect(project.completed).toBe(true)
      }, )
      test('[10] responds with a 400 if the request body is missing all fields', async () => {
        const res = await request(server).put('/api/projects/1').send({})
        expect(res.status).toBe(400)
      }, )
    })
    describe('[DELETE] /api/projects/:id', () => {
      test('[11] deletes the action with the given id', async () => {
        await request(server).delete('/api/projects/1')
        let res = await Project.get()
        expect(res).toMatchObject([projectB])
        await request(server).delete('/api/projects/2')
        res = await Project.get()
        expect(res).toMatchObject([])
      }, )
      test('[12] responds with a 404 if no project with given id', async () => {
        const res = await request(server).delete('/api/projects/11')
        expect(res.status).toBe(404)
      }, )
    })
    describe('[GET] /api/projects/:id/actions', () => {
      test('[13] sends back the actions in project with given id', async () => {
        const res = await request(server).get('/api/projects/1/actions')
        expect(res.body).toMatchObject(actions)
      }, )
      test('[14] sends back empty array if no actions in project with given id', async () => {
        const res = await request(server).get('/api/projects/2/actions')
        expect(res.body).toMatchObject([])
      }, )
    })
  })
  // 👉 ACTIONS
  // 👉 ACTIONS
  // 👉 ACTIONS
  describe('actions endpoints', () => {
    describe('[GET] /api/actions', () => {
      test('[15] sends back all actions that exist', async () => {
        const res = await request(server).get('/api/actions')
        expect(res.body).toHaveLength(2)
        expect(res.body[0]).toMatchObject(actionA)
        expect(res.body[1]).toMatchObject(actionB)
      }, )
      test('[16] sends back empty array if no actions', async () => {
        await db('actions').truncate()
        const res = await request(server).get('/api/actions')
        expect(res.body).toHaveLength(0)
      }, )
    })
    describe('[GET] /api/actions/:id', () => {
      test('[17] sends back the action with given id', async () => {
        const res1 = await request(server).get('/api/actions/1')
        const res2 = await request(server).get('/api/actions/2')
        expect(res1.body).toMatchObject(actionA)
        expect(res2.body).toMatchObject(actionB)
      }, )
      test('[18] responds with a 404 if no action with given id', async () => {
        const res = await request(server).get('/api/actions/11')
        expect(res.status).toBe(404)
      }, )
    })
    describe('[POST] /api/actions', () => {
      test('[19] responds with the newly created action', async () => {
        const actionNew = { project_id: 2, description: 'm', notes: 'n', completed: false }
        const res = await request(server).post('/api/actions').send(actionNew)
        expect(res.body).toMatchObject(actionNew)
      }, )
      test('[20] inserts a new action into actions table', async () => {
        const actionNew = { project_id: 2, description: 'm', notes: 'n', completed: false }
        await request(server).post('/api/actions').send(actionNew)
        const action = await Action.get(3)
        expect(action).toMatchObject(actionNew)
      }, )
      test('[21] responds with a 400 if the request body is missing required fields', async () => {
        const actionNew = { project_id: 2, description: 'm' }
        const res = await request(server).post('/api/actions').send(actionNew)
        expect(res.status).toBe(400)
      }, )
    })
    describe('[PUT] /api/actions/:id', () => {
      test('[22] responds with the updated action', async () => {
        const action = await Action.get(1)
        const changes = { ...action, completed: true }
        expect(action.completed).toBe(false)
        const res = await request(server).put('/api/actions/1').send(changes)
        expect(res.body).toMatchObject(changes)
      }, )
      test('[23] updates the action in the actions table', async () => {
        let action = await Action.get(1)
        await request(server).put('/api/actions/1').send({ ...action, completed: true })
        action = await Action.get(1)
        expect(action.completed).toBe(true)
      }, )
      test('[24] responds with a 400 if the request body is missing all fields', async () => {
        const res = await request(server).put('/api/actions/1').send({})
        expect(res.status).toBe(400)
      }, )
    })
    describe('[DELETE] /api/actions/:id', () => {
      test('[25] deletes the action with the given id', async () => {
        await request(server).delete('/api/actions/1')
        let actions = await Action.get()
        expect(actions).toMatchObject([actionB])
        await request(server).delete('/api/actions/2')
        actions = await Action.get()
        expect(actions).toMatchObject([])
      }, )
      test('[26] responds with a 404 if no action with given id', async () => {
        const res = await request(server).get('/api/actions/11')
        expect(res.status).toBe(404)
      }, )
    })
  })
})
