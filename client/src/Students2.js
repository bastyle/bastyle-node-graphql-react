import { gql, useQuery, useMutation } from "@apollo/client";
import StudentForm from './StudentForm';
import React, { useState } from 'react';

const GET_STUDENTS = gql`
{
    students
    {
        _id
        name
        email
        age
        major
        year
    }
}
`
const ADD_STUDENT = gql`
  mutation AddStudent($name: String!, $email: String!, $age: Int!, $major: String!, $year: Int!) {
    addStudent(name: $name, email: $email, age: $age, major: $major, year: $year) {
      _id
      name
      email
      age
      major
      year
    }
  }
`;

const UPDATE_STUDENT = gql`
  mutation UpdateStudent($_id: String!, $name: String!, $email: String!, $age: Int!, $major: String!, $year: Int!) {
    updateStudent(_id: $_id, name: $name, email: $email, age: $age, major: $major, year: $year) {
      _id
      name
      email
      age
      major
      year
    }
  }
`;

const DELETE_STUDENT = gql`
  mutation DeleteStudent($_id: String!) {
    deleteStudent(_id: $_id) {
      _id
      name
    }
  }
`;

export default function Students2() {
    //console.log("getting students...")
    const { loading, error, data, refetch } = useQuery(GET_STUDENTS);
    const [isAddingStudent, setIsAddingStudent] = useState(false);
    const [isUpdatingStudent, setIsUpdatingStudent] = useState(false);
    const [updatingStudentData, setUpdatingStudentData] = useState(null);
    const [addStudent] = useMutation(ADD_STUDENT);
    const [updateStudent] = useMutation(UPDATE_STUDENT);
    const [deleteStudent] = useMutation(DELETE_STUDENT);


    const handleUpdate = (student) => {
        console.log(student.name+ "id: "+ student._id +" is being updated");
        setIsUpdatingStudent(true);
        setUpdatingStudentData(student);
    }

    const handleDeleteStudent = async (_id) => {
        try {
            const { data } = await deleteStudent({
                variables: { _id },
            });

            console.log('Student Deleted:', data.deleteStudent);
            refetch();
        } catch (error) {
            console.error('Error deleting student:', error.message);
        }
    };

    if (loading) return <p>Loading, Please wait</p>
    if (error) return <p>Error</p>
    const handleFetch = () => {
        refetch();
       // console.log(data.students);
    }



    const handleAddOrUpdateStudent = async (formData) => {
        try {
            console.log('Trying to add/update student:', formData);
            formData.age = parseInt(formData.age, 10);
            formData.year = parseInt(formData.year, 10);
            console.log("isUpdatingStudent: "+isUpdatingStudent);
            if (isUpdatingStudent) {
                console.log("Inside update");
                formData._id=updatingStudentData._id
                console.log("form: "+JSON.stringify(formData));
                const { data } = await updateStudent({
                    variables: formData,
                });

                console.log('Updated Student:', formData);
                setIsUpdatingStudent(false);
                setUpdatingStudentData(null);
            } else {
                // Implement logic for adding the new student on the server
                const { data } = await addStudent({
                    variables: formData,
                });

                console.log('New Student Added:', data.addStudent);
            }

            refetch();
        } catch (error) {
            console.error('Error adding/updating student:', error.message);
        }
    }

    return (
        <div>
            <h2>Students Records</h2>
            <button onClick={handleFetch}>Refresh Students</button>
            <button onClick={() => setIsAddingStudent(true)}>Add New Student</button>
            {isAddingStudent && (
                <StudentForm
                    onSubmit={handleAddOrUpdateStudent}
                    onCancel={() => setIsAddingStudent(false)}
                />
            )}

            {isUpdatingStudent && updatingStudentData && (
                <StudentForm
                    onSubmit={handleAddOrUpdateStudent}
                    onCancel={() => {
                        setIsUpdatingStudent(false);
                        setUpdatingStudentData(null);
                    }}
                    initialData={updatingStudentData}
                />
            )}

            <table className="students-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Major</th>
                        <th>Year</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.students.map(student => (
                        <tr key={student._id}>
                            <td>{student._id}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.age}</td>
                            <td>{student.major}</td>
                            <td>{student.year}</td>
                            <td>
                                <button onClick={() => handleUpdate(student)}>Update</button>
                                <button onClick={() => handleDeleteStudent(student._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}