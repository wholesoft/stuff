import { useParams, useLocation } from "react-router-dom";
import {AddEditStuffForm } from '../test/AddEditStuffForm'

const EditItem = () => {

    const { item_id } = useParams();
    const location = useLocation();
    let { data } = location.state
    data = data[0];
    console.log(JSON.stringify(data))
    console.log(JSON.stringify(data.id))


    return (
        <section>
            <h1>Edit Item { item_id }</h1>
            <br />
            <AddEditStuffForm data={data} item_id={ item_id } />
        </section>
    )
}

export { EditItem };