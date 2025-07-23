// This is the main Employee type used throughout your application at runtime.
export type Employee = {
  id: string; // Use string for IDs like 'EMP-123'
  profileImage: string | null;
  status: 'active' | 'inactive';

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
    userName: string;
    employeeType: string;
    emailAddress: string;
    department: string;
    designation: string;
    workingDays: string;
    joiningDate: string;
    officeLocation: string;
  };

  documents: {
    title: string;
    fileName: string;
    dataUrl: string; // The Base64 string for the file
  }[];

  accountAccess: {
    slackId: string;
    skypeId: string;
    githubId: string;
  };
};

// This is the type for the data collected in the PersonalForm
export type PersonalFormData = Employee['personalInfo'];

// This is the type for the data collected in the ProfessionalForm
export type ProfessionalFormData = Omit<Employee['professionalInfo'], 'userName' | 'emailAddress'> & {
    employeeID: string;
    userName: string;
    emailAddress: string;
};

// This is the type for a single document object used in the upload process
export type Document = {
  title: string;
  file: {
    name: string;
    dataUrl: string;
  } | null;
};