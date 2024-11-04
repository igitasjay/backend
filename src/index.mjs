import express from "express";

const app = express();

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

app.get("/api/users", (request, response) => {
  const {
    query: { filter, value },
  } = request;
  if (!filter && !value) return response.send(mockUsers);
});

app.get("/api/users/:id", (request, response) => {
  const id = request.params.id;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.status(400).json("Bad request");
  const findUser = mockUsers.find((user) => user.id === parsedId);
  if (!findUser)
    return response.status(404).json(`User with ID '${id}' not found!`);
  return response.send(findUser);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`started listening on port ${PORT}`);
});
