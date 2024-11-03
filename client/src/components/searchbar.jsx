import React, { useState } from 'react'
import searchIcon from '../assets/search-icon.png'

function Searchbar(props) {
    const [input, setInput] = useState("")

    const handleChange = (e) => {
        setInput(e.target.value)
        props.setKeyword(e.target.value)
        props.setDisplaySuggestions(true)
    }

    const handleClick = () => {
      props.setDisplaySuggestions(prevState => !prevState)
    }
  
    return (
    <div className='flex items-center justify-around bg-white w-full h-10 max-w-lg m-8 px-4 rounded-md'>
      <img src={searchIcon} className='w-6'/>
      <input 
        className='h-full w-full p-4 text-lg text-gray-600 rounded-md focus:outline-none'
        id="searchbar"
        placeholder='Enter text here'
        value={input}
        onChange={handleChange}
        onClick={handleClick}
      >
      </input>
    </div>
  )
}

export default Searchbar
