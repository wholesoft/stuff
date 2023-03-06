import { Link } from 'react-router-dom'


const Stuff = () => {
   
    return (
      <div>
        <h1>Stuff</h1>
        <ul>
            <li><Link to='/stuff/Camping'>Camping</Link></li>  
            <li><Link to='/stuff/Motorcycle'>Motorcycle</Link></li>          
        </ul>
      </div>
    )
  }

  export { Stuff };