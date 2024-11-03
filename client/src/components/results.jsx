import React, { useState, useEffect } from 'react'
import ResultItem from './resultItem'
import Table from './table'

function Results(props) {
    const [results, setResults] = useState([])
    
    useEffect(() => {
        if(!props.reference)
            return
        
        const controller = new AbortController()
        const signal = controller.signal

        const urlExtension1 = props.method === 'name' ? `name=${encodeURIComponent(props.reference.name)}` : `composition=${encodeURIComponent(props.reference)}`
        const urlExtension2 = props.method === 'name' ? `&type=${encodeURIComponent(props.reference.type)}` : ""
        console.log(urlExtension1)
        fetch(`http://localhost:3000/substitute/${props.method}?${urlExtension1}${urlExtension2}`, {signal})
          .then(res => res.json())
          .then(json => setResults(json.data))
          .catch(err => console.log(err))
        
        return () => {
          controller.abort()
        }
    }, [props.reference])

    console.log(results)

    return (
    // <div className=' text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-x-28 md:gap-y-10 lg:gap-x-16 overscroll-none'>
    //     {results.length > 0 && results.map((item, index) => {
    //         return <ResultItem key={index} data={item}/>
    //     })}
    // </div>
    <div>
      {props.reference && results.length > 0 
      ? <Table results={results}/>
      : props.reference && <h3 className='text-white text-2xl font-bold my-12'>No Results Found</h3>
      }
    </div>
  )
}

export default Results
