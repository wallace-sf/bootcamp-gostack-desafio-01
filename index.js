const express = require('express')

const server = express()
const projects = []
let numberRequests = 0

function checkIsString(req, res, next) {
  const id = req.params.id ? req.params.id : req.body.id
  const { title } = req.body

  if (!(typeof id === 'string') || !(typeof title === 'string')) {
    return res.json({ message: 'Id and title must be string' })
  }

  return next()
}

function checkProjectById(req, res, next) {
  const { id } = req.params

  const index = projects.findIndex(project => project.id === id)

  if (index < 0) {
    return res.status(400).json({ message: 'Id not found' })
  }

  req.index = index

  return next()
}

function countRequests(req, res, next) {
  numberRequests++

  console.log(`Count requests: ${numberRequests}`)

  next()
}

server.use(express.json())
server.use(countRequests)

server.get('/projects', (req, res) => {
  return res.json(projects)
})

server.post('/projects', checkIsString, (req, res) => {
  const project = req.body

  projects.push(project)

  return res.json(project)
})

server.post('/projects/:id/tasks', checkIsString, checkProjectById, (req, res) => {
  const { title } = req.body
  projects[req.index].tasks = [...projects[req.index].tasks, title ]

  return res.json(projects[req.index])
})

server.put('/projects/:id', checkIsString, checkProjectById, (req, res) => {
  const { title } = req.body

  projects[req.index] = { ...projects[req.index], title }

  return res.json(projects[req.index])
})

server.delete('/projects/:id', checkProjectById, (req, res) => {
  projects.splice(req.index, 1)

  return res.send()
})

server.listen(3000, () => console.log('Backend is running on port 3000'))