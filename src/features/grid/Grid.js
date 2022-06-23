import React, { useState } from 'react'
import "./Grid.css"
import Cell from '../cell/Cell.js'
import analyse from "./analyse";
import DisplayText from "./DisplayText";

export default function Grid() {
    const dim = 16
    const control = [..."ABCDEFGHJKLMNOPQRSTUVWXYZ"].slice(0, dim)
    const [cells, setCells] = useState({...Array(dim**2).fill({isOn: false})})
    const [meta, setMeta] = useState({dim: dim, upperLeft: [dim,dim], lowerRight: [-1,-1]})

    const handleClick = cell => {
        const [updatedCells, updatedMeta] = analyse(cell, cells, meta)

        setCells(updatedCells)
        setMeta(updatedMeta)
    }

    const resetCells = () => {
        const clearedCells = {...cells}
        for (const cell in cells) {
            clearedCells[cell] = {isOn: false}
        }
        setCells(clearedCells)
        setMeta({dim: dim, upperLeft: [dim,dim], lowerRight: [-1,-1]})
    }

    return (
        <>
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
            {meta.lowerRight[0] > -1 && (
                <div className='pattern-info'>
                    <h2>Information</h2>
                    <DisplayText label='Width' text={meta.width} />
                    <DisplayText label='Height' text={meta.height} />
                    <DisplayText label='Stable' boolean={meta.isStable} />
                    <DisplayText label='Quarter Rotation' boolean={meta.symmetry.quarter} />
                    <DisplayText label='Half Rotation' boolean={meta.symmetry.half} />
                    <DisplayText label='Vertical Reflection' boolean={meta.symmetry.vertical} />
                    <DisplayText label='Horizontal Reflection' boolean={meta.symmetry.horizontal} />
                    <DisplayText label='Diagonal Reflection' boolean={meta.symmetry.diagonal} />
                    <DisplayText label='Anti-diagonal Reflection' boolean={meta.symmetry.antiDiagonal} />
                    <h4>Variants</h4>
                    {meta.variants.map((v,i) => (<div key={i}>{v}</div>))}
                </div>
                )}
        </>
    )
}