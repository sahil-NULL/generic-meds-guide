import React from 'react'
import { useRouteError} from 'react-router-dom'

function error() {
    const error = useRouteError()
    console.error(error)
    return (
    <div id="error">
        <h1>Oops!</h1>
        <p>Looks like you ran into an error</p>
        <p>
            <i>{error.statusText || error.message}</i>
        </p>
    </div>
  )
}

export default error
