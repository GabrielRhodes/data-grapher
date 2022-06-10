import { useState } from 'react'

function ColorModel({ visible, data }) {
  const [colors, setColors] = useState(
    '#4363d8,#f58231,#ffd8b1,#000075,#bfef45,#dcbeff,#f032e6,#469990,#808000,#911eb4,#aaffc3,#fffac8,#e6194B,#fabed4,#42d4f4,#9A6324'
  )

  function updateColors(val, i) {
    var colorArr = colors.split(',')
    colorArr[i] = val
    setColors(colorArr.join(','))
  }

  return (
    <>
      <input id='pie-color-info' type='hidden' value={colors} />
      {visible[0] ? (
        <>
          <div id='blur' onClick={() => visible[1](false)}></div>
          <div className='model'>
            <button className='quit-button' onClick={() => visible[1](false)}>
              &#x2715;
            </button>
            {colors.split(',').map((color, i) => (
              <div key={i}>
                <div>
                  {data.split('\n')[i]?.split(',')[0] || `Field ${i + 1}`}
                </div>
                <input
                  type='color'
                  value={color}
                  onChange={(e) => updateColors(e.target.value, i)}
                ></input>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </>
  )
}

export default ColorModel
