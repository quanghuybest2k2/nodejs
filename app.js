const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

// fake data
const users = [
  { id: 1, name: "Nguyễn Văn A", email: "nga@example.com", age: 28 },
  { id: 2, name: "Trần Thị B", email: "btran@example.com", age: 35 },
  { id: 3, name: "Lê Văn C", email: "levac@example.com", age: 42 },
];

// Config Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API quản lý người dùng",
      version: "1.0.0",
      description: "API đơn giản để quản lý thông tin người dùng",
    },
  },
  apis: ["./app.js"], // file chứa các routes
};

const swaggerSpec = swaggerJsdoc(options);

// Middleware Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({
    message: "Hello world!",
  });
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     description: Trả về toàn bộ danh sách người dùng
 *     responses:
 *       200:
 *         description: Danh sách người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   age:
 *                     type: integer
 */
app.get("/users", (req, res) => {
  // Logic lấy danh sách người dùng
  res.json(users);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *       404:
 *         description: Không tìm thấy người dùng
 */
app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "Không tìm thấy người dùng" });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Tạo người dùng mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tạo người dùng thành công
 */
app.post("/users", express.json(), (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`http://3.27.216.224/api-docs/`);
});
