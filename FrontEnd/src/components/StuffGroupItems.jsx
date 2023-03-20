import { Link } from 'react-router-dom'
import { useResourcePrivate } from '../hooks/useResourcePrivate'

const StuffGroupItems = ( props ) => {
    const { group_id } = props

    const items = useResourcePrivate(`/stuff/${group_id}`);
    console.log (JSON.stringify(items));
    // [{"id", "group_name","notes","created","updated"}]
    return items ? (
        <>
        <ul>
        {items.map((data, idx) => (
        <li key={data.id}>
            <Link to='/' state={{ data }}>{data.item_name}</Link></li>
      ))}
        </ul>
        </>

    ) : <p>Loading...</p>
}

export { StuffGroupItems }