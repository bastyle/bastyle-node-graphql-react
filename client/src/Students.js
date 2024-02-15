import {gql, useQuery} from "@apollo/client";

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

export default function Students()
{
    console.log("getting students...")
   const {loading, error, data , refetch}  =  useQuery(GET_STUDENTS);
   const handleFetch = ()=>{
    refetch();
    console.log(data.students);
   }

   if(loading) return <p>Loading, Please wait</p>
   if(error) return <p>Error</p>

    return (
        <div>
            <ul>
            { data.students.map(student => <li key={student._id}>{student.name}</li>)}
            </ul>
            < button onClick={handleFetch}>Make API Call</button>
        </div>
    )
}