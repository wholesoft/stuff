import { AddStuffGroupForm } from '../components/AddStuffGroup'
import {StuffGroups } from '../components/StuffGroups'
import {StuffGroupsTable } from '../components/StuffGroupsTable'

const Stuff = () => {
   
    return (
      <div>
        <h1>Stuff</h1>
        <StuffGroupsTable />

        <AddStuffGroupForm />
      </div>

    )
  }

  export { Stuff };