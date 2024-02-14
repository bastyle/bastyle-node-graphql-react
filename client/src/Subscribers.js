import {gql, useQuery} from "@apollo/client";

const GET_SUBSCRIBERS = gql`
{
    subscribers
    {
        _id
        name
    }
}
`

export default function Subscribers()
{

   const {loading, error, data , refetch}  =  useQuery(GET_SUBSCRIBERS);
   const handleFetch = ()=>{
    refetch();
    console.log(data.subscribers);
   }

   if(loading) return <p>Loading, Please wait</p>
   if(error) return <p>Error</p>

    return (
        <div>
            <ul>
            { data.subscribers.map(subscriber => <li key={subscriber._id}>{subscriber.name}</li>)}
            </ul>
            < button onClick={handleFetch}>Make API Call</button>
        </div>
    )
}