
export type Employee = {
  id: string; 
  profileImage: string | null;
  status: 'active' | 'inactive';

  personalInfo: {
    profileImage: string | null; 
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
    dataUrl: string; 
  }[];

  accountAccess: {
    slackId: string;
    skypeId: string;
    githubId: string;
  };
};


export type PersonalFormData = Employee['personalInfo'];


export type ProfessionalFormData = Omit<Employee['professionalInfo'], 'userName' | 'emailAddress'> & {
    employeeID: string;
    userName: string;
    emailAddress: string;
};


export type Document = {
  title: string;
  file: {
    name: string;
    dataUrl: string;
  } | null;
};
