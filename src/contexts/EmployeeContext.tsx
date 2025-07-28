'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

// Define the shape of an Employee record for runtime use in your app
export type Employee = {
  id: number;
  profileImage?: string | null;
  status: 'active' | 'inactive';
  fullName: string;

  personalInfo: {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    email: string;
    dateOfBirth: string;
    maritalStatus: string;
    gender: string;
    nationality: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };

  professionalInfo: {
    employeeID: string;
    userName: string;
    employeeType: string;
    emailAddress: string;
    department: string;
    designation: string;
    joiningDate: string;
    officeLocation: string;
  };

  accountAccess: {
    slackId?: string;
    skypeId?: string;
    githubId?: string;
  };

  // In the running app, documents can be File objects
  documents: (File | null)[];
};

// --- FIX: Define types for the data as it is stored in JSON ---

// A simple object to represent a document in localStorage
type SerializableDocument = {
  name: string;
  type: string;
};

// The shape of the Employee as it exists in localStorage's JSON string
// It uses Omit to replace the complex `documents` property with the simple one
type SerializableEmployee = Omit<Employee, 'documents'> & {
  documents: (SerializableDocument | null)[];
};


// Define the context type
interface EmployeeContextType {
  employees: Employee[];
  loading: boolean;
  addEmployee: (employeeData: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: number, updatedData: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // On load, get employees from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('employees');
    if (stored) {
      try {
        // FIX: Assert the parsed type as our SerializableEmployee array, removing 'any'
        const parsed = JSON.parse(stored) as SerializableEmployee[];
        
        // FIX: The 'emp' parameter is now correctly typed
        const restoredEmployees = parsed.map((emp: SerializableEmployee) => ({
          ...emp,
          // FIX: The 'doc' parameter is now correctly typed
          documents: emp.documents?.map((doc: SerializableDocument | null) =>
            // Reconstruct the File object for runtime use
            doc ? new File([""], doc.name, { type: doc.type }) : null
          ) || [],
        }));
        setEmployees(restoredEmployees);
      } catch (error) {
        console.error('Error parsing stored employees:', error);
        setEmployees([]);
      }
    }
    setLoading(false);
  }, []);

  const saveEmployees = (updated: Employee[]) => {
    setEmployees(updated);
    // Convert the runtime Employee objects back to the simple, serializable format
    const serializable = updated.map(emp => ({
      ...emp,
      documents: emp.documents?.map(doc =>
        // Only store name and type, not the full File object
        doc ? { name: doc.name, type: doc.type } : null
      ) || [],
    }));
    localStorage.setItem('employees', JSON.stringify(serializable));
  };

  const addEmployee = (data: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = { ...data, id: Date.now() };
    saveEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (id: number, updatedData: Partial<Employee>) => {
    const updatedList = employees.map(emp =>
      emp.id === id ? { ...emp, ...updatedData } : emp
    );
    saveEmployees(updatedList);
  };

  const deleteEmployee = (id: number) => {
    const filtered = employees.filter(emp => emp.id !== id);
    saveEmployees(filtered);
  };

  return (
    <EmployeeContext.Provider
      value={{ employees, loading, addEmployee, updateEmployee, deleteEmployee }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};