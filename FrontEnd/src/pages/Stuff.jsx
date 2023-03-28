import { AddStuffGroupForm } from '../components/AddStuffGroup'
import {AddGroupForm } from '../components/AddGroupForm'
import {StuffGroupsTable2 } from '../components/StuffGroupsTable2'
import {StuffGroupsTable3 } from '../components/StuffGroupsTable3'
import {StuffGroupsTable4 } from '../components/StuffGroupsTable4'

const Stuff = () => {
   
    return (
      <div>
        <StuffGroupsTable4 />
        <AddGroupForm data={{}} />
      </div>

    )
  }

  export { Stuff };