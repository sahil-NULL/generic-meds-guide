import React, { useEffect, useState } from 'react'
import sortObjectsByRelevance from '../helpers/sortObjectsByRelevance'
import sortStringsByRelevance from '../helpers/sortStringsByRelevance'

function SearchResult(props) {
    const [apiData, setApiData] = useState([])
    const [isVisible, setIsVisible] = useState(true)
    
    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
    
        props.keyword.length >= 3 
            ? fetch(`http://localhost:3000/autocomplete/${props.method}?keyword=${props.keyword}`, {signal})
                .then(res => res.json())
                .then(json => {
                    const sortedData = props.method === 'name' ? sortObjectsByRelevance(json.data, props.keyword) : sortStringsByRelevance(json.data, props.keyword)
                    setApiData(sortedData)
                })
                .catch(err => console.log(err))
            : setApiData([]) 
    
        return () => {
            controller.abort()
        }
    }, [props.keyword])

    // console.log(apiData)

    const handleClick = (result) => {
        setIsVisible(false)
        props.setReference(result)
        console.log(result)
    }
  
    return (
    <div className='flex flex-col w-full max-w-lg max-h-72 rounded-lg bg-white m-20 absolute overflow-y-auto'>
        {isVisible && props.method === 'name' 
            ? apiData.map((result, index) => {
                return <p 
                    key={index}
                    className='text-gray-600 px-4 py-2 border-b-2 cursor-pointer hover:bg-gray-200 capitalize'
                    onClick={() => handleClick(result)}
                >
                    {result.name.toLowerCase()}
                </p>
            })
            : isVisible && props.method === 'composition' &&
            apiData.map((result, index) => {
                return <p 
                    key={index}
                    className='text-gray-600 px-4 py-2 border-b-2 cursor-pointer hover:bg-gray-200'
                    onClick={() => handleClick(result)}
                >
                    {result}
                </p>
            })
        }
    </div>
  )
}

export default SearchResult