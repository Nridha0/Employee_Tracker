const inquirer = require ('inquirer'); 
const path = require("path");
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
      
        password: 'rootroot',
        database: 'employeeTracker_db'
    },
    console.log(`Connected to the employeeTracker_db database.`)
);

Questions = () => {
    inquirer.prompt([
      {
          name: 'todo',
          type: 'rawlist',
          message: 'Welcome to the employee management program. What would you like to do?',
          choices: ['View all departments', 'View all roles', 'View all employees', 'View all employees by manager', 'Add a department', 'Add a role', 'Add an employee', 'Update employee\'s role', 'Update employee\'s manager', 'Exit program']
      }
  ]).then((response) => {
      switch (response.todo) {
          case 'View all departments':
              viewAllDepartments();    
              break;
                  case 'View all employees':
                      viewAllEmployees();
                      break;
                  case 'View all employees by department':
                      viewAllEmployeesByDepartment();
                      break;
                      case 'View all employees by manager':
                    viewAllEmployeesByManager();
                    break;
                case 'Add employee':
                    addEmployee();
                    break;
                case 'Add department':
                    addDepartment();
                    break;
                case 'Add role':
                    addRole();
                    break;
                case 'Update employee role':
                    updateEmployeeRole();
                    break;
                case 'Update employee manager':
                    updateEmployeeManager();
                    break;
                case 'Exit':
                    console.log('Thank you!');
                    break;
                default:
                    console.log('Something went wrong.');
                    break;
                  }
                })
            }

    allDepartments = () => {
        connection.query(`SELECT * FROM department ORDER BY department_id ASC;`, (err, res) => {
            if (err) throw err;
            console.table('\n', res, '\n');
            allDepartments();
            
        })
    };

    allRoles = () => {
        connection.query(`SELECT role.role_id, role.title, role.salary, department.department_name, department.department_id FROM role JOIN department ON role.department_id = department.department_id ORDER BY role.role_id ASC;`, (err, res) => {
            if (err) throw err;
            console.table('\n', res, '\n');
            allRoles();
            
        })
    };

    allEmployees = () => {
        connection.query(`SELECT e.employee_id, e.first_name, e.last_name, role.title, department.department_name, role.salary, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee m RIGHT JOIN employee e ON e.manager_id = m.employee_id JOIN role ON e.role_id = role.role_id JOIN department ON department.department_id = role.department_id ORDER BY e.employee_id ASC;`, (err, res) => {
            if (err) throw err;
            console.table('\n', res, '\n');
            allEmployees();
          
        })
    };

    EmployeesByManager = () => {
        connection.query(`SELECT employee_id, first_name, last_name FROM employee ORDER BY employee_id ASC;`, (err, res) => {
            if (err) throw err;
            let managers = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
            inquirer.prompt([
                {
                name: 'manager',
                type: 'rawlist',
                message: 'Which manager would you like to see the employee\'s of?',
                choices: managers   
                },
            ]).then((response) => {
                connection.query(`SELECT e.employee_id, e.first_name, e.last_name, role.title, department.department_name, role.salary, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee m RIGHT JOIN employee e ON e.manager_id = m.employee_id JOIN role ON e.role_id = role.role_id JOIN department ON department.department_id = role.department_id WHERE e.manager_id = ${response.manager} ORDER BY e.employee_id ASC`, 
                (err, res) => {
                    if (err) throw err;
                    console.table('\n', res, '\n');
                    EmployeesByManager();
                    
                })
            })
        })
    }

    department = ()=>{
        inquirer.prompt([
            {
            name:'Deptartment',
            type: 'input',
            message: 'What is the name of the department?'
            }
        ])
        .then((response) => {
            connection.query(`INSERT INTO department SET ?`, 
            {
                department_name: response.newDept,
            },
            (err, res) => {
                if (err) throw err;
                console.log(`\n ${response.Deptartment} added service to the database! \n`);
                departments();
            })
        })
    };
    
    Role = ()=>{
        connection.query(`SELECT * FROM department;`, (err, res) => {
            if (err) throw err;
            let departments = res.map(department => ({name: department.department_name, value: department.department_id }));
            inquirer.prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'What would you like to do?'   
                },
                {
                name: 'title',
                type: 'input',
                message: 'What is the name of the role?'   
                },
                {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of the role?'   
                },
                {
                name: 'deptName',
                type: 'list',
                message: 'Which department does the role belong to?',
                choices: departments
                },
            ]).then((response) => {
                connection.query(`INSERT INTO role SET ?`, 
                {
                    title: response.title,
                    salary: response.salary,
                    department_id: response.deptName,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n ${response.title} successfully added to database! \n`);
                    allEmployees();
                })
            })
        })
    };

    updateEmployeeRole = () => {
        connection.query(`SELECT * FROM role;`, (err, res) => {
            if (err) throw err;
            let roles = res.map(role => ({name: role.title, value: role.role_id }));
            connection.query(`SELECT * FROM employee;`, (err, res) => {
                if (err) throw err;
                let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
                inquirer.prompt([
                    {
                        name: 'employee',
                        type: 'list',
                        message: 'Which employee would you like to update the role for?',
                        choices: employees
                    },
                    {
                        name: 'newRole',
                        type: 'list',
                        message: 'What is the employee new role?',
                        choices: roles
                    },
                ]).then((response) => {
                    connection.query(`UPDATE employee SET ? WHERE ?`, 
                    [
                        {
                            role_id: response.newRole,
                        },
                        {
                            employee_id: response.employee,
                        },
                    ], 
                    (err, res) => {
                        if (err) throw err;
                        console.log(`\n added service to the database! \n`);
                        updateEmployeeRole();
                    })
                })
            })
        })
    }

    addAEmployee = () => {
    connection.query(`SELECT * FROM role;`, (err, res) => {
        if (err) throw err;
        let roles = res.map(role => ({name: role.title, value: role.role_id }));
        connection.query(`SELECT * FROM employee;`, (err, res) => {
            if (err) throw err;
            let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id}));
            inquirer.prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'What is the employee first name?'
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'What is the new employee last name?'
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'What is the title?',
                    choices: roles
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: 'Who is the manager?',
                    choices: employees
                }
            ]).then((response) => {
                connection.query(`INSERT INTO employee SET ?`, 
                {
                    first_name: response.firstName,
                    last_name: response.lastName,
                    role_id: response.role,
                    manager_id: response.manager,
                }, 
                (err, res) => {
                    if (err) throw err;
                })
                connection.query(`INSERT INTO role SET ?`, 
                {
                    department_id: response.dept,
                }, 
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n ${response.firstName} ${response.lastName} added service to the database! \n`);
                    updateEmployeeRole();
                })
            })
        })
    })
};


updateEmployeesManager = () => {
    connection.query(`SELECT * FROM employee;`, (err, res) => {
        if (err) throw err;
        let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
        inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Which employee manager you need to update for?',
                choices: employees
            },
            {
                name: 'newManager',
                type: 'list',
                message: 'Who is the employee new manager be?',
                choices: employees
            },
        ]).then((response) => {
            connection.query(`UPDATE employee SET ? WHERE ?`, 
            [
                {
                    manager_id: response.newManager,
                },
                {
                    employee_id: response.employee,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n  \n`);
                updateEmployeeManager();
            })
        })
    })
};