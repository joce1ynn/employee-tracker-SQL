INSERT INTO departments (dept_name) 
VALUES
("Sales"),
("Technology"),
("Legal");

INSERT INTO roles (title, salary, dept_id) 
VALUES
("Sales Manager", "120000", 1),
("Sales Representative", "70000", 1),
("IT Manager", "130000", 2),
("Software Developer", "100000", 2),
("General Counsel", "140000", 3),
("Legal Assistant", "60000", 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) 
VALUES
("Katelyn","Booth",1,null),
("Hasan","Mcintosh",2,1),
("Taha","Jones",3,null),
("Jerry","Lynch",4,3),
("Sylvie","Riley",5,null),
("Abdullah","Wiggins",6,5);

