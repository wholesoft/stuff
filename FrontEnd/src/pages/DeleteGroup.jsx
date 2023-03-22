import { useParams, useNavigate } from "react-router-dom";
import { useResourcePrivate } from '../hooks/useResourcePrivate'

const DeleteGroup = () => {
    const { group_id } = useParams();
    const navigate = useNavigate();
    const deleteData = useResourcePrivate(`/delete_group/${group_id}`)
    // TODO: DISPLAY ERRROR MESSAGE IF IT DOESN'T WORK
    navigate(-1)

    return deleteData ? (
        <section>
            <h1>Delete Group ({group_id})</h1>
            <p>{ JSON.stringify(deleteData) }</p>
        </section>
    ): <p>LOADING...</p>
}

export { DeleteGroup };