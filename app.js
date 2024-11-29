const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Config MySQL
const pool = mysql.createPool({
  host:  process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_DATABASE ?? "",
});

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
    api_docs: "http://3.27.216.224/api-docs",
  });
});

// Endpoint: Lấy danh sách người dùng
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
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 */
app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM `users`");
    res.json(rows);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     description: Trả về thông tin chi tiết của một người dùng theo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Không tìm thấy người dùng
 */
app.get("/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const [rows] = await pool.query("SELECT * FROM `users` WHERE id = ?", [
      userId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`http://3.27.216.224/api-docs/`);
});
