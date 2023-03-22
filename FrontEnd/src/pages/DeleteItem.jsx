import { useParams, useNavigate } from "react-router-dom";
import { useResourcePrivate } from '../hooks/useResourcePrivate'

const DeleteItem = () => {
    const { item_id } = useParams();
    const navigate = useNavigate();
    const deleteData = useResourcePrivate(`/delete_item/${item_id}`)
    navigate(-1)

    return deleteData ? (
        <section>
            <h1>Delete Item ({item_id})</h1>
            <p>{ JSON.stringify(deleteData) }</p>
        </section>
    ): <p>LOADING...</p>
}

export { DeleteItem };