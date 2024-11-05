import express from "express";

const app = express();
app.use(express.json());

const mockUsers = [
  {
    id: 1,
    username: "jay",
    displayName: "Jay",
  },
  {
    id: 2,
    username: "cee",
    displayName: "Cee",
  },
  {
    id: 3,
    username: "bee",
    displayName: "Bee",
  },
];

app.get("/", (request, response) => {
  response.send("Get request completed!");
});

// GET request
app.get("/api/users", (request, response) => {
  const {
    query: { filter, value },
  } = request;
  // when filter and value exists
  if (filter && value)
    return response.send(
      mockUsers.filter((user) => user[filter].includes(value))
    );
  // when filter and/or value are defined
  return response.send(mockUsers);
});

// POST request
app.post("/api/users", (request, response) => {
  // unpacking in javascript: where { body } on the left side of the assignment means "take the body property from the request object and assign it to a new variable also named body"
  const { body } = request;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newUser);
  return response.status(200).send(newUser);
});

// GET request by identifier
app.get("/api/users/:id", (request, response) => {
  const id = request.params.id;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.status(400).json("Bad request");
  const findUser = mockUsers.find((user) => user.id === parsedId);
  if (!findUser)
    return response.status(404).json(`User with ID '${id}' not found!`);
  return response.send(findUser);
});

// a PUT request affects the entire record the requesrt is made to.
app.put("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  mockUsers[findUserIndex] = { id: parsedId, ...body };
  return response.sendStatus(200);
});

// PATCH request: used for records where all of the fields may not be changes in a single request
app.patch("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`started listening on port ${PORT}`);
});
