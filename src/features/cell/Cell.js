import React from 'react'

export default function Cell(props) {
    const {ix, cell, onClick} = props
    const classes = "grid-cell " + (cell.isOn ? "cell-on" : "cell-off")

    return (
        <td className={classes} onClick={() => onClick(ix)} />
    )
}