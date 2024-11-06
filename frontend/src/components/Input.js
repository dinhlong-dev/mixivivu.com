import React, { memo } from 'react'

const input = ({ textColor, bgColor, bdRadius }) => {
    return (
        <button
            type='button'
            className={`${textColor} ${bgColor} outline-none ${bdRadius}`}
        >
        </button>
    )
}

export default memo(input)