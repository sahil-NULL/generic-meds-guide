import React from 'react'

function ResultItem(props) {
    console.log(props)
    const unitPrice = props.data.price / props.data.quantity
    return (
        <div className='bg-green-600 max-w-96 px-4 py-2 rounded-lg'>
            <h2 className='text-lg font-bold'>{props.data.name}</h2>
            <p className='text-base'>{props.data.brand}</p>
            <p className='mt-10'>{`₹${unitPrice.toFixed(2)} / ${props.data.unit}`}</p>
            <p>{props.data.composition}</p>
        </div>
    )
}

export default ResultItem
