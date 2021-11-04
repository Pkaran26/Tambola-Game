const { useState, useEffect } = React

const Tambola = () => {
  const [displayArray, setDisplayArray] = useState([])
  const [currentNumber, setCurrentNumber] = useState('')

  useEffect(() => {
    const socket = io()
    const gameId = window.location.href.split('viewer/')
    socket.emit('NEW_ARRAY', gameId[1])
    socket.emit('NEW_NUM', gameId[1])

    socket.on('SEND_NEW_ARRAY', (data) => {
      setDisplayArray(data)
    })

    socket.on('SEND_NEW_NUM', (data) => {
      setCurrentNumber(data)
    })

    setInterval(() => {
      socket.emit('NEW_ARRAY', gameId[1])
      socket.emit('NEW_NUM', gameId[1])
    }, 2000)
  }, [])

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-lg-3'>
          <div className='card'>
            <div className='card-body'>
              <h4 className='text-center text-danger'>{currentNumber}</h4>
            </div>
          </div>
        </div>
        <div className='col-lg-9'>
          <table className='table table-bordered'>
            <tbody>
              {displayArray && displayArray.length > 0 ?
                displayArray.map((arr, i) => (
                  <tr key={i}>
                    {arr.map((e, j) => (
                      <td className={`text-center number-block ${e.used ? 'bg-info text-white' : ''}`} key={j}>{e.number}</td>
                    ))}
                  </tr>
                ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(<Tambola />, document.getElementById('root'))
