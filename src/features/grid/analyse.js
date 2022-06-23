export default function analyse(cellId, cellValues, meta) {
    const rotate = (variant, width, height) => {
        const array = [...variant]
        let trans = ''

        for (let r = 0; r < width; ++r) {
            for (let c = height-1; c >= 0; --c) {
                trans += array[width * c + r]
            }
        }

        return trans
    }

    const reflect = (variant, width, height) => {
        const array = [...variant]
        let trans = ''

        for (let r = 0; r < height; ++r) {
            for (let c = width-1; c >=0 ; --c) {
                trans += array[width * r + c]
            }
        }

        return trans
    }

    const inScope = (index) => {
        const x = index % dim, y = Math.floor(index/dim)

        return ! (
            (x < midV && (vertical || quarter || (half && !diagonal))) ||
            (y < midH && (horizontal || quarter)) ||
            (x === midV && y > midH && width%2 === 1 && half && !diagonal) ||
            (y+dim-x-1 < midD && diagonal) ||
            (x+y < midA && antiDiagonal)
        )
    }

    const {dim, upperLeft, lowerRight} = meta
    const row = Math.floor(cellId/dim)
    const col = cellId % dim

    const cells = {...cellValues, [cellId]: {isOn: !cellValues[cellId].isOn}}
    upperLeft[0] = Math.min(upperLeft[0],row)
    upperLeft[1] = Math.min(upperLeft[1],col)
    lowerRight[0] = Math.max(lowerRight[0],row)
    lowerRight[1] = Math.max(lowerRight[1],col)

    const
        height = lowerRight[0] - upperLeft[0] + 1,
        width = lowerRight[1] - upperLeft[1] + 1,
        midV = upperLeft[1] + Math.floor(width/2),
        midH = upperLeft[0] + Math.floor(height/2),
        midA = upperLeft[0] + upperLeft[1] + width - 1,
        midD = upperLeft[0] + dim-upperLeft[1]-1,
        variants = ['']

    // Get life for symmetry check
    for (let r = upperLeft[0]; r <= lowerRight[0]; ++r) {
        for (let c = upperLeft[1]; c <= lowerRight[1]; ++c) {
            variants[0] += cells[dim*r+c].isOn ? "1" : "0"
        }
    }

    // Check for rotational symmetry
    let quarter = false, half = false
    let trans = rotate(variants[0], width, height)

    if (width === height && trans === variants[0]) {
        quarter = half = true
    }
    else {
        variants.push(trans)
        trans = rotate(trans, height, width)

        if (trans === variants[0]) {
            half = true
        }
        else {
            variants.push(trans)
            variants.push(rotate(trans, width, height))
        }
    }

    // Check for reflective symmetry
    let vertical = false, horizontal = false, diagonal = false, antiDiagonal = false
    trans = reflect(variants[0], width, height)

    if (quarter) {
        if (trans === variants[0]) {
            vertical = horizontal = diagonal = antiDiagonal = true
        }
        else {
            variants.push(trans)
        }
    }
    else if (half) {
        switch (trans) {
            case variants[0]:
                vertical = horizontal = true
                break
            case variants[1]:
                diagonal = antiDiagonal = true
                break
            default:
                variants.push(trans)
                variants.push(reflect(variants[1], height, width))
        }
    }
    else {
        switch (trans) {
            case variants[0]:
                vertical = true
                break
            case variants[1]:
                diagonal = true
                break
            case variants[2]:
                horizontal = true
                break
            case variants[3]:
                antiDiagonal = true
                break
            default:
                variants.push(trans)
                variants.push(reflect(variants[1], height, width))
                variants.push(reflect(variants[2], width, height))
                variants.push(reflect(variants[3], height, width))
        }
    }

    // check life for stability and extension points
    let isStable = true

    for (let r = upperLeft[0]-1; r <= lowerRight[0]+1; ++r) {
        for (let c = upperLeft[1] - 1; c <= lowerRight[1] + 1; ++c) {
            cells[dim * r + c].candidate = cells[dim * r + c].restricted = false
        }
    }

    for (let r = upperLeft[0]-1; r <= lowerRight[0]+1; ++r) {
        for (let c = upperLeft[1]-1; c <= lowerRight[1]+1; ++c) {
            // count number of neighbours
            let neighbours = 0
            for (let n = 0; n < 9; ++n) {
                if (n !== 4) neighbours += cells[dim*(r+Math.floor(n/3)-1) + c+n%3-1].isOn ? 1 : 0
            }
            cells[dim*r+c].neighbours = neighbours


            if (cells[dim*r+c].isOn ? neighbours !== 2 && neighbours !== 3 : neighbours === 3) {
                isStable = false
            }

            if (cells[dim*r+c].isOn) {
                if (neighbours > 2) {                           // restrict neighbours
                    for (let p = 0; p < 9; ++p) {
                        if (p !== 4) {
                            const ix = dim*(r+Math.floor(p/3)-1) + c+p%3-1
                            if (! cells[ix].isOn) {

                                cells[ix].restricted = true
                                cells[ix].candidate = false
                            }
                        }
                    }
                }
            }
            else if (neighbours > 0 && neighbours < 3 && ! cells[dim*r+c].restricted) {
                cells[dim*r+c].candidate = inScope(dim*r+c)
            }
            else if (neighbours === 3) {
                for (let p = 0; p < 9; ++p) {
                    const ix = dim*(r+Math.floor(p/3)-1) + c+p%3-1
                    if (! cells[ix].isOn && ! cells[ix].restricted) {
                        cells[ix].candidate = inScope(ix)
                    }
                }
            }
            else if (neighbours > 3) {
                cells[dim*r+c].restricted = true
                cells[dim*r+c].candidate = false
            }
        }
    }

    return [cells, {...meta, upperLeft, lowerRight, width, height, isStable, variants, symmetry: {quarter, half, vertical, horizontal, diagonal, antiDiagonal} }]
}