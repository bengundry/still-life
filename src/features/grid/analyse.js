export default function analyse(cell, cellValues, meta) {
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

    const {dim, upperLeft, lowerRight} = meta
    const row = Math.floor(cell/dim)
    const col = cell % dim

    const cells = {...cellValues, [cell]: {isOn: !cellValues[cell].isOn}}
    upperLeft[0] = Math.min(upperLeft[0],row)
    upperLeft[1] = Math.min(upperLeft[1],col)
    lowerRight[0] = Math.max(lowerRight[0],row)
    lowerRight[1] = Math.max(lowerRight[1],col)

    const
        height = lowerRight[0] - upperLeft[0] + 1,
        width = lowerRight[1] - upperLeft[1] + 1,
        variants = ['']

    for (let r = upperLeft[0]; r <= lowerRight[0]; ++r) {
        for (let c = upperLeft[1]; c <= lowerRight[1]; ++c) {
            variants[0] += cells[dim*r+c].isOn ? "1" : "0"
        }
    }

    // Check for rotational symmetry
    let hasQuarterRotation = false, hasHalfRotation = false
    let trans = rotate(variants[0], width, height)

    if (width === height && trans === variants[0]) {
        hasQuarterRotation = hasHalfRotation = true
    }
    else {
        variants.push(trans)
        trans = rotate(trans, height, width)

        if (trans === variants[0]) {
            hasHalfRotation = true
        }
        else {
            variants.push(trans)
            variants.push(rotate(trans, width, height))
        }
    }

    // Check for reflective symmetry
    let hasRefV = false, hasRefH = false, hasRefD = false, hasRefA = false
    trans = reflect(variants[0], width, height)

    if (hasQuarterRotation) {
        if (trans === variants[0]) {
            hasRefV = hasRefH = hasRefD = hasRefA = true
        }
        else {
            variants.push(trans)
        }
    }
    else if (hasHalfRotation) {
        switch (trans) {
            case variants[0]:
                hasRefV = hasRefH = true
                break
            case variants[1]:
                hasRefD = hasRefA = true
                break
            default:
                variants.push(trans)
                variants.push(reflect(variants[1], height, width))
        }
    }
    else {
        switch (trans) {
            case variants[0]:
                hasRefV = true
                break
            case variants[1]:
                hasRefD = true
                break
            case variants[2]:
                hasRefH = true
                break
            case variants[3]:
                hasRefA = true
                break
            default:
                variants.push(trans)
                variants.push(reflect(variants[1], height, width))
                variants.push(reflect(variants[2], width, height))
                variants.push(reflect(variants[3], height, width))
        }
    }

    return [cells, {...meta, upperLeft, lowerRight, width, height, hasQuarterRotation, hasHalfRotation, hasRefV, hasRefH, hasRefD, hasRefA, variants}]
}