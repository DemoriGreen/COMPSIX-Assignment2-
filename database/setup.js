const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "task_management.db",
});

// USER
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// PROJECT
const Project = sequelize.define("Project", {
  name: DataTypes.STRING,
  userId: DataTypes.INTEGER,
});

// TASK
const Task = sequelize.define("Task", {
  title: DataTypes.STRING,
  projectId: DataTypes.INTEGER,
});

// RELATIONSHIPS
User.hasMany(Project);
Project.belongsTo(User);

Project.hasMany(Task);
Task.belongsTo(Project);

sequelize.sync();

module.exports = { sequelize, User, Project, Task };
