const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>hello world how are you doing today</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const persons = persons.filter((person) => person.id !== id);
  response.status(402).end();
});

// generate unique id for each person
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "there is no number",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  const names = persons.map((p) => p.name);
  if (names.includes(person.name)) {
    return response.status(400).json({
      error: "the name already exist",
    });
  }

  persons = persons.concat(person);
  response.json(person);
});

morgan.token("host", (request, response) => {
  console.log(request.headers);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
