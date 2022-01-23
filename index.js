const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee",
});

const purpose = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "purpose",
      message: "What would you like to do?",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "Add Department",
        "Add Role",
        "Add Employee",
      ],
    },
  ]);
};

purpose().then((data) => {
  if (data.purpose === "view all departments") {
    viewDept();
  }
  // else data.purpose ===
});

const viewDept = () => {
  db.promise()
    .query(`SELECT * from departments`)
    .then((data) => {
      console.table(data);
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
