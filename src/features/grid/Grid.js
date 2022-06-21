import React, { useState } from 'react'
import "./Grid.css"
import Cell from '../cell/Cell.js'

export default function Grid() {
    const dim = 16
    const control = [..."ABCDEFGHJKLMNOPQRSTUVWXYZ"].slice(0, dim)
    const [cells, setCells] = useState(Object.assign({}, Array(dim**2).fill({isOn: false})))

    const handleClick = cell => {
        setCells( {...cells, [cell]: {isOn: !cells[cell].isOn}})
    }

    const resetCells = () => {
        const clearedCells = {}
        for (const cell in cells) {
            clearedCells[cell] = {isOn: false}
        }
        setCells(clearedCells)
    }

    return (
        <div className='data-entry'>
            <table className='entry-grid'>
                <tbody>
                {control.map((row, rix) =>
                    <tr key={rix}>
                        {control.map((col, cix) =>
                            <Cell key={rix*dim+cix} ix={rix*dim+cix} cell={cells[rix*dim+cix]} onClick={handleClick} />
                        )}
                    </tr>
                )}
                </tbody>
            </table>
            <div className='tool-bar'>
                <button onClick={() => resetCells()}>Reset</button>
            </div>
        </div>
    )
}