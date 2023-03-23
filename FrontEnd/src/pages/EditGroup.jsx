import { useParams, useLocation } from "react-router-dom";
import {AddEditGroupForm } from '../components/AddEditGroupForm'

const EditGroup = () => {

    const { group_id } = useParams();
    const location = useLocation();
    let { data } = location.state
    data = data[0];
    console.log(JSON.stringify(data))
    console.log(JSON.stringify(data.id))


    return (
        <section>
            <h1>Edit { data.group_name }</h1>
            <br />
            <AddEditGroupForm data={data} group={ group_id } />
        </section>
    )
}

export { EditGroup };