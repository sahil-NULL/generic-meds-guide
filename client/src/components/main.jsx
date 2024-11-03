import React, { useEffect, useState } from 'react'
import Searchbar from './searchbar.jsx'
import SearchResult from './searchResult.jsx'
import Results from './results.jsx'
import ResultItem from './resultItem.jsx'

function Main(props) {
  const [reference, setReference] = useState("")
  const [keyword, setKeyword] = useState("")
  const [displaySuggestions, setDisplaySuggestions] = useState(true)
  // const [results, setResults] = useState([])

  console.log(reference)
    
  return (
    <div className='bg-black w-full h-screen flex flex-col items-center overflow-x-hidden overscroll-x-none'> 
      <div className='w-4/5 max-w-lg flex flex-col items-center relative z-50'>
          <Searchbar 
            setKeyword={setKeyword} 
            setDisplaySuggestions={setDisplaySuggestions}
          />

          {keyword.length >= 3 && displaySuggestions && <SearchResult 
            method={props.method}
            keyword={keyword} 
            setReference={setReference}
          /> }      
      </div>

      {reference && props.method === 'name'
      ? <div className='text-white w-4/5'>
        <h2 className=' text-lg font-medium my-4'>Showing results for:</h2>
        <ResultItem method={props.method} data={reference}/>
      </div>
      : reference && props.method === 'composition' && 
      <div className='text-white w-4/5 flex flex-col lg:flex-row'>
        <h2 className='text-lg my-4 min-w-44'>Showing results for:</h2>
        <h2 className='text-lg my-4 font-bold italic lg:mx-2'>{reference}</h2>  
      </div>}

      <Results 
        method={props.method}
        reference={reference}
      />
    </div>
  )
}

export default Main
