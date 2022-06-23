import React from 'react'

export default function Cell(props) {
    const {ix, cell, onClick} = props
    const classes = "grid-cell " + (cell.isOn ?
        (cell.neighbours === 3 ? "cell-stable3" : cell.neighbours === 2 ? "cell-stable2" : cell.neighbours > 3 ? "cell-overloaded" :"cell-unstable" ) :
        (cell.candidate ? "cell-candidate" : "cell-off"))

    return (
        <td className={classes} onClick={() => onClick(ix)} />
    )
}