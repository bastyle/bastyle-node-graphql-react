import { gql, useQuery, useMutation } from "@apollo/client";
import StudentForm from './StudentForm';
import React, { useState } from 'react';

const GET_STUDENTS = gql`
{
    students
    {
        _id
        name
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

export default function Students() {
    //console.log("getting students...")
    const { loading, error, data, refetch } = useQuery(GET_STUDENTS);
    const [isAddingStudent, setIsAddingStudent] = useState(false);
    const [addStudent] = useMutation(ADD_STUDENT);
    const [deleteStudent] = useMutation(DELETE_STUDENT);

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
        console.log(data.students);
    }

    const handleAddStudent = async (formData) => {
        try {
            console.log('trying to add student.'+ formData)
            formData.age = parseInt(formData.age,10)
            formData.year = parseInt(formData.year,10)
            console.log('trying to add student 2.'+ formData)
            const { data } = await addStudent({
                variables: formData,
            });
            console.log('trying to add student 2.')
            console.log('New Student Added:', data.addStudent);
            refetch();
        } catch (error) {
            console.error('Error adding student:', error.message);
        }
    };

    const handleUpdate = (student) => {
        // Implement logic for updating student
        console.log(`Updating student: ${student.name}`);
    }

    return (
        <div>
            <h2>Students Records</h2>
            <button onClick={handleFetch}>Refresh Students</button>
            <button onClick={() => setIsAddingStudent(true)}>Add New Student</button>
            {isAddingStudent && (
                <StudentForm
                    onSubmit={handleAddStudent}
                    onCancel={() => setIsAddingStudent(false)}
                />
            )}
            <table className="students-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
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