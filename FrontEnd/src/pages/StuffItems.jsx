import { useParams } from 'react-router-dom'


export function StuffItems()  {
    const { category } = useParams()
    return (
      <div>
        <h1>{ category } Stuff</h1>
      </div>
    )
  }

