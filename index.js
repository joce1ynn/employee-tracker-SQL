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
  db.query(
    `SELECT roles.role_id, roles.title, departments.name AS department, roles.salary 
     FROM roles 
     INNER JOIN departments 
     ON roles.dept_id = departments.dept_id;`,
    (err, data) => {
      if (err) throw err;
      console.table(data);
      purpose();
    }
  );
};

// view all employees
const viewEmployee = () => {
  db.query(
    `SELECT employees.employee_id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(managers.first_name, " ", managers.last_name) AS manager
     FROM roles 
     INNER JOIN employees  
     ON roles.role_id = employees.role_id
     INNER JOIN departments
     ON roles.dept_id = departments.dept_id
     LEFT JOIN employees managers
     ON managers.employee_id = employees.manager_id 
     ORDER BY employee_id
     ;`,
    (err, data) => {
      if (err) throw err;
      console.table(data);
      purpose();
    }
  );
};

// add a new department
const addDept = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the department?",
      },
    ])
    .then((answer) => {
      db.query(
        `INSERT INTO departments (name) 
         VALUES ("${answer.name}") ;`,
        (err, data) => {
          if (err) throw err;
        }
      );
      console.log("Added", `${answer.name}`, "to the database");
      purpose();
    });
};

// add a new role
const addRole = () => {
  db.query(`SELECT * FROM departments;`, (err, data) => {
    if (err) throw err;

    let deptArray = [];

    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the name of the role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
        },
        {
          type: "list",
          name: "department",
          message: "Which department does the role belong to?",
          choices: function () {
            for (let i = 0; i < data.length; i++) {
              deptArray.push(data[i].name);
            }
            return deptArray;
          },
        },
      ])
      .then((answer) => {
        db.query(
          `INSERT INTO roles (title, salary, dept_id)
           VALUES ("${answer.title}", "${answer.salary}", "${
            deptArray.indexOf(answer.department) + 1
          }");`,
          (err, data) => {
            if (err) throw err;
          }
        );
        console.log("Added", `${answer.title}`, "to the database");
        purpose();
      });
  });
};

// add an employee
const addEmployee = () => {
  let managerArray = ["N/A"];
  let managerIdArray = [];
  let roleArray = [];

  // get manager array
  db.query(`SELECT * FROM employees WHERE manager_id IS NULL;`, (err, data) => {
    if (err) throw err;

    data.map((manager) => {
      managerArray.push(`${manager.first_name} ${manager.last_name}`);
      managerIdArray.push(`${manager.employee_id}`);
    });

    return { managerArray, managerIdArray };
  });

  // get role array
  db.query(`SELECT * FROM roles;`, (err, data) => {
    if (err) throw err;

    data.map((role) => roleArray.push(`${role.title}`));
    return roleArray;
  });

  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "title",
        message: "What is the employee's role?",
        choices: roleArray,
      },
      {
        type: "list",
        name: "manager",
        message: "What is the employee's manager?",
        choices: managerArray,
      },
    ])
    .then((answer) => {
      let roleId = roleArray.indexOf(answer.title) + 1;

      let managerId;
      if (answer.manager === "N/A") {
        managerId = null;
      } else {
        managerId = managerIdArray[managerArray.indexOf(answer.manager) - 1];
      }

      db.query(
        `INSERT INTO employees (first_name, last_name, role_id, manager_id)
         VALUES ("${answer.firstName}", "${answer.lastName}", ${roleId}, ${managerId});`,

        (err, data) => {
          if (err) throw err;
        }
      );
      console.log(
        "Added",
        `${answer.firstName} ${answer.lastName}`,
        "to the database"
      );
      purpose();
    });
};

// update an employee role
const updateRole = () => {
  db.query(
    `SELECT employees.employee_id, CONCAT(employees.first_name," ", employees.last_name) AS name, roles.title, roles.role_id
     FROM employees 
     LEFT JOIN roles 
     ON roles.role_id = employees.employee_id
     ORDER BY employee_id;`,
    (err, data) => {
      if (err) throw err;

      let employeeArray = [];
      let roleArray = [];

      // get employee array
      data.map((employee) => employeeArray.push(`${employee.name}`));

      // get role array
      db.query(`SELECT * FROM roles;`, (err, data) => {
        if (err) throw err;

        data.map((role) => roleArray.push(`${role.title}`));
        return roleArray;
      });

      inquirer
        .prompt([
          {
            type: "list",
            name: "name",
            message: "Which employee's role do you want to update?",
            choices: employeeArray,
          },
          {
            type: "list",
            name: "title",
            message: "What is the employee's new role?",
            choices: roleArray,
          },
          {
            type: "input",
            name: "managerId",
            message: "What is the employee's manager id?",
          },
        ])
        .then((answer) => {
          let firstName = answer.name.split(" ")[0];
          let lastName = answer.name.split(" ")[1];
          let roleId = roleArray.indexOf(answer.title) + 1;

          db.query(
            `UPDATE employees
             SET role_id = ${roleId}, manager_id = ${answer.managerId}
             WHERE first_name = "${firstName}" AND last_name = "${lastName}";`,
            (err, data) => {
              if (err) throw err;
            }
          );
          console.log("Updated", `${answer.name}`, "'s role to the database");
          purpose();
        });
    }
  );
};
