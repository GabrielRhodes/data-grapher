import { useEffect } from 'react'

function ErrorMessage({ visible }) {
  useEffect(() => {
    setInterval(() => visible[1](false), 7000)
  }, [visible])

  return (
    <>
      <div className={visible[0] ? 'error-model' : 'hidden'}>
        <button className='quit-button' onClick={() => visible[1](false)}>
          &#x2715;
        </button>
        <p id='error-text'></p>
      </div>
    </>
  )
}

export default ErrorMessage
