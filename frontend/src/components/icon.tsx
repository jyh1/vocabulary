import React from 'react'
import '@fortawesome/fontawesome-free/css/all.css'

export default (props: {icon: string}) => {
    const {icon} = props
    return (<i {...props} className={`fa fa-${icon}`} aria-hidden="true" />)
}