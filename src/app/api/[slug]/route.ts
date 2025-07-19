import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Define Employee type for type safety
type Employee = {
  id: string;
  personal: {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    emailAddress: string;
    dateOfBirth: string;
    maritalStatus: string;
    gender: string;
    nationality: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  professional: {
    employeeID: string;
    userName: string;
    employeeType: string;
    emailAddress: string;
    department: string;
    designation: string;
    joiningDate: string;
    officeLocation: string;
  };
};

// In-memory storage for mock data
const employees: Employee[] = [];
const documents: { employeeId: string; files: { name: string; url: string }[] }[] = [];
const photos: { employeeId: string; url: string }[] = [];
const accountAccess: { employeeId: string; emailAddress: string; slackId: string; skypeId: string; githubId: string }[] = [];

// POST /api/employees - Add personal and professional information
export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (slug === 'employees') {
    try {
      const body = await request.json();
      const employeeId = uuidv4();
      const employee: Employee = {
        id: employeeId,
        personal: {
          firstName: body.firstName || '',
          lastName: body.lastName || '',
          mobileNumber: body.mobileNumber || '',
          emailAddress: body.emailAddress || '',
          dateOfBirth: body.dateOfBirth || '',
          maritalStatus: body.maritalStatus || '',
          gender: body.gender || '',
          nationality: body.nationality || '',
          address: body.address || '',
          city: body.city || '',
          state: body.state || '',
          zipCode: body.zipCode || '',
        },
        professional: {
          employeeID: body.employeeID || '',
          userName: body.userName || '',
          employeeType: body.employeeType || '',
          emailAddress: body.emailAddress || '',
          department: body.department || '',
          designation: body.designation || '',
          joiningDate: body.joiningDate || '',
          officeLocation: body.officeLocation || '',
        },
      };
      employees.push(employee);
      return NextResponse.json({ id: employeeId, message: 'Employee added successfully' }, { status: 201 });
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
  }

  if (slug === 'documents') {
    try {
      const formData = await request.formData();
      const employeeId = formData.get('employeeId') as string;
      const files = formData.getAll('files') as File[];

      const uploadedFiles = files.map((file) => ({
        name: file.name,
        url: `/uploads/documents/${employeeId}/${file.name}`,
      }));

      const existingDocs = documents.find((doc) => doc.employeeId === employeeId);
      if (existingDocs) {
        existingDocs.files.push(...uploadedFiles);
      } else {
        documents.push({ employeeId, files: uploadedFiles });
      }

      return NextResponse.json({ message: 'Documents uploaded successfully', files: uploadedFiles }, { status: 201 });
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      return NextResponse.json({ error: 'Document upload failed' }, { status: 400 });
    }
  }

  if (slug === 'photos') {
    try {
      const formData = await request.formData();
      const employeeId = formData.get('employeeId') as string;
      const file = formData.get('file') as File;

      const photoUrl = `/uploads/photos/${employeeId}/${file.name}`;
      photos.push({ employeeId, url: photoUrl });

      return NextResponse.json({ message: 'Photo uploaded successfully', url: photoUrl }, { status: 201 });
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      return NextResponse.json({ error: 'Photo upload failed' }, { status: 400 });
    }
  }

  if (slug === 'account-access') {
    try {
      const body = await request.json();
      const employeeId = body.employeeId;
      const accessData = {
        employeeId,
        emailAddress: body.emailAddress || '',
        slackId: body.slackId || '',
        skypeId: body.skypeId || '',
        githubId: body.githubId || '',
      };
      accountAccess.push(accessData);
      return NextResponse.json({ message: 'Account access saved successfully' }, { status: 201 });
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
  }

  return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
}

// GET /api/employees - Retrieve all employees (for testing)
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (slug === 'employees') {
    const employeeData = employees.map((emp) => ({
      ...emp,
      documents: documents.find((doc) => doc.employeeId === emp.id)?.files || [],
      photo: photos.find((photo) => photo.employeeId === emp.id)?.url || null,
      accountAccess: accountAccess.find((acc) => acc.employeeId === emp.id) || null,
    }));
    return NextResponse.json(employeeData, { status: 200 });
  }

  return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
}