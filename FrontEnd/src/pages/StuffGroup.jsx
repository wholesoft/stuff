import { ItemsTable } from '../components/ItemsTable'
import { AddEditStuffForm } from '../components/AddEditStuffForm'
import { useParams } from 'react-router-dom'

const StuffGroup = (props) => {


    const { group_id } = useParams();
   
    return (
      <div>
        <h1>Stuff { group_id }</h1>
        <ItemsTable groupId={ group_id } />

        <AddEditStuffForm data={{}} groupId={ group_id } />
      </div>

    )
  }

  export { StuffGroup };