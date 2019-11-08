const express = require("express");
const server = express();

server.use(express.json());

const projects = [];
let requests = 0;

server.use((req, res, next) => {
  console.log(++requests);

  return next();
});

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;

  const index = projects.findIndex(project => project.id === Number(id));

  if (index < 0) {
    return res.status(404).json({ error: "Project not found." });
  }

  req.index = index;

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[req.index].tasks.push(title);

  return res.json(projects);
});

server.put("/projects/:id", checkIfProjectExists, (req, res) => {
  const { title } = req.body;

  projects[req.index].title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;

  projects.splice(req.index, 1);

  return res.status(204).send();
});

server.listen(3333);
