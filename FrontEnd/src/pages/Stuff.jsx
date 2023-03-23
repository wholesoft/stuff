import { AddStuffGroupForm } from '../components/AddStuffGroup'
import {AddEditGroupForm } from '../components/AddEditGroupForm'
import {StuffGroupsTable } from '../components/StuffGroupsTable'

const Stuff = () => {
   
    return (
      <div>
        <h1>Stuff</h1>
        <StuffGroupsTable />

        <AddEditGroupForm data={{}} />
      </div>

    )
  }

  export { Stuff };