import React, { memo } from 'react'

const Button = ({ text, textColor, bgColor, py, px, hoverbg, hovertext, bdRadius, onClick }) => {
    return (
        <button
            type='button'
            className={`${textColor} ${bgColor} outline-none font-medium ${py} ${px} ${hoverbg} ${hovertext} ${bdRadius}`}
            onClick={onClick}
        >
            {text}
        </button>
    )
}

export default memo(Button)