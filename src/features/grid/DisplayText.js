import React from 'react'

export default function DisplayText (props) {
    let value = ''

    if ('text' in props)
        value = props.text
    else if ('boolean' in props)
        value = props.boolean ? "true" : "false"

    return (
        <div className='label-value'>
            <div className='label'>{props.label}</div>
            <div className='value'>{value}</div>
        </div>
    )
}