const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// connect to mysql database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  purpose();
});

// start the app
const purpose = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "purpose",
        message: "What would you like to do?",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
          "EXIT",
        ],
      },
    ])
    .then((data) => {
      if (data.purpose === "view all departments") {
        viewDept();
      } else if (data.purpose === "view all roles") {
        viewRole();
      } else if (data.purpose === "view all employees") {
        viewEmployee();
      } else if (data.purpose === "add a department") {
        addDept();
      } else if (data.purpose === "add a role") {
        addRole();
      } else if (data.purpose === "add an employee") {
        addEmployee();
      } else if (data.purpose === "update an employee role") {
        updateRole();
      } else if (data.purpose === "EXIT") {
        db.end();
        console.log("Exiting the app...");
      }
    });
};

// view all departments
const viewDept = () => {
  db.query(`SELECT * from departments;`, (err, data) => {
    if (err) throw err;
    console.table(data);
    purpose();
  });
};

// view all roles
const viewRole = () => {
  db.query(`SELECT roles.role_id, roles.title, roles.salary, departments.dept_name from roles INNER JOIN departments on roles.dept_id = departments.dept_id;`, (err, data) => {
    if (err) throw err;
    console.table(data);
    purpose();
  });
};

// const addDepartment = () => {
//   return inquirer.prompt([
//     {
//       type: "input",
//       name: "name",
//       message: "Please provide the department's name:",
//     },
//   ]);
// };
