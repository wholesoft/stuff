import { AddStuffGroupForm } from '../components/AddStuffGroup'
import {AddEditGroupForm } from '../components/AddEditGroupForm'
import {StuffGroupsTable2 } from '../components/StuffGroupsTable2'

const Stuff = () => {
   
    return (
      <div>
        <h1>Stuff</h1>
        <StuffGroupsTable2 />

       { /* <AddEditGroupForm data={{}} /> */ }
      </div>

    )
  }

  export { Stuff };