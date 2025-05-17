"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/shadcn-button";
import EmployeeCard from "@/components/employee/employeeCard";

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface Employee {
  id: string;
  name: string;
  email: string;
}

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showNewEmployee, setShowNewEmployee] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const handleAddEmployee = () => {
    setShowNewEmployee(true);
  };

  const handleSaveEmployee = (
    id: string | undefined,
    data: EmployeeFormData
  ) => {
    if (id) {
      // Update existing employee
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === id ? { ...emp, ...data } : emp))
      );
    } else {
      // Add new employee
      setEmployees((prev) => [...prev, { id: `emp-${Date.now()}`, ...data }]);
      setShowNewEmployee(false);
    }
    reset();
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  return (
    <div className="p-4 space-y-4">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          id={employee.id}
          name={employee.name}
          email={employee.email}
          onDelete={handleDeleteEmployee}
          onSave={handleSaveEmployee}
        />
      ))}
      {showNewEmployee && <EmployeeCard isNew onSave={handleSaveEmployee} />}
      <Button
        variant="outline"
        className="w-full border-primary text-primary"
        onClick={handleAddEmployee}
      >
        Add Employee
      </Button>
    </div>
  );
}
