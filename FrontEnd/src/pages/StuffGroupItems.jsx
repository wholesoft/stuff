import { useLocation } from 'react-router-dom'
import { AddStuffForm } from '../components/AddStuffForm'
import { StuffGroupItems } from '../components/StuffGroupItems'


export function StuffItems()  {
    const location = useLocation();
    const { data } = location.state
    console.log(JSON.stringify(data))


    return (
      <div>
        <h1>{ data.group_name } Stuff</h1>
        <StuffGroupItems group_id={ data.id } />
        <AddStuffForm group_id={ data.id } />
      </div>
    )
  }
