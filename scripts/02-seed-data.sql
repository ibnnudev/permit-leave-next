-- Insert default leave types
INSERT INTO leave_types (name, description, max_days_per_year) VALUES
('Annual Leave', 'Yearly vacation days', 25),
('Sick Leave', 'Medical leave', 10),
('Personal Leave', 'Personal time off', 5),
('Maternity/Paternity Leave', 'Family leave', 90),
('Emergency Leave', 'Urgent personal matters', 3);

-- Insert admin user (password: admin123)
INSERT INTO users (email, password_hash, role) VALUES
('admin@company.com', '$2b$10$rQZ9QmjlhQZ9QmjlhQZ9QOK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8', 'admin');

-- Insert sample employees
INSERT INTO users (email, password_hash, role) VALUES
('john.doe@company.com', '$2b$10$rQZ9QmjlhQZ9QmjlhQZ9QOK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8', 'employee'),
('jane.smith@company.com', '$2b$10$rQZ9QmjlhQZ9QmjlhQZ9QOK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8', 'employee'),
('mike.johnson@company.com', '$2b$10$rQZ9QmjlhQZ9QmjlhQZ9QOK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8', 'employee');

-- Insert employee details
INSERT INTO employees (user_id, first_name, last_name, employee_id, department, position, hire_date) VALUES
(2, 'John', 'Doe', 'EMP001', 'Engineering', 'Software Developer', '2023-01-15'),
(3, 'Jane', 'Smith', 'EMP002', 'Marketing', 'Marketing Manager', '2022-06-01'),
(4, 'Mike', 'Johnson', 'EMP003', 'HR', 'HR Specialist', '2023-03-10');

-- Insert sample leave requests
INSERT INTO leave_requests (employee_id, leave_type_id, start_date, end_date, days_requested, reason, status) VALUES
(1, 1, '2024-02-15', '2024-02-19', 5, 'Family vacation', 'approved'),
(2, 2, '2024-01-20', '2024-01-22', 3, 'Medical appointment', 'pending'),
(3, 1, '2024-03-01', '2024-03-05', 5, 'Personal time off', 'pending');
