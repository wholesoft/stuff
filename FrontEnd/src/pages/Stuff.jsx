import { AddStuffGroupForm } from '../components/AddStuffGroup'
import {StuffGroups } from '../components/StuffGroups'

const Stuff = () => {
   
    return (
      <div>
        <h1>Stuff</h1>
        <StuffGroups />

        <AddStuffGroupForm />
      </div>

    )
  }

  export { Stuff };