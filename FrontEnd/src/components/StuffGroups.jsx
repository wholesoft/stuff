import { Link } from 'react-router-dom'
import { useResourcePrivate } from '../hooks/useResourcePrivate'

const StuffGroups = ( props ) => {
    const groups = useResourcePrivate(`/stuff_groups`);
    console.log (JSON.stringify(groups));
    // [{"id", "group_name","notes","created","updated"}]
    return groups ? (
        <>
        <ul>
        {groups.map((data, idx) => (
        <li key={data.id}>
            <Link to='/stuff-items'state={{ data }}>{data.group_name}</Link></li>
      ))}
        </ul>
        </>

    ) : <p>Loading...</p>
}

export { StuffGroups }