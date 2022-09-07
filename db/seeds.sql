INSERT INTO department(id, departmentName)
VALUES 
('Software Engineer'),
('Sales'),
('CEO'),
('Finance');

INSERT INTO role (id, role_title, Salary, department_id)
VALUES
(1, 'Full Stack Developer', 80000, "1"),
(2, 'HR Conslutant', 36000, "2"),
(3, 'Accountant', 125000, "3"),
(4, 'Sales Lead', 100000, "4"),

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES 
(1, "John", "Doe", 1, NULL)
(2, "Chris", "Brown", 1, 2)
(3, "Sarah", "Bell", 1, NULL)
(4, "Tom", "Evans", 3, 4)