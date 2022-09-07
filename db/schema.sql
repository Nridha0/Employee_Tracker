--Create db
DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;
USE employeeTracker_db;

--create department table
CREATE TABLE department(
id INT NOT NULL auto_increment PRIMARY KEY,
name VARCHAR(30)
);

--create role table
CREATE TABLE role_t (
    id INT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL, 
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

--create employees table
CREATE TABLE employee (
    id INT PRIMARY KEY auto_increment NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR (30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_t_id) REFERENCES role_t(id),
);

