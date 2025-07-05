import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext'

const Recommended = () => {

    const {books} = useContext(UserContext)
    console.log(books);
    

  return (
    <div>
      
    </div>
  )
}

export default Recommended
