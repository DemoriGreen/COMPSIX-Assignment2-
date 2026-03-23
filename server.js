const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const { User, Project, Task } = require("./database/setup");

const app = express();
app.use(express.json());

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// REGISTER
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  res.json({ message: "User registered" });
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid email" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: "Invalid password" });
  }

  req.session.userId = user.id;

  res.json({ message: "Login successful" });
});

// AUTH MIDDLEWARE
function authMiddleware(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// PROTECTED ROUTE
app.get("/api/projects", authMiddleware, async (req, res) => {
  const projects = await Project.findAll({
    where: { userId: req.session.userId },
  });

  res.json(projects);
});

// LOGOUT
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
