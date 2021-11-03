const { useState, useEffect } = React

const Tambola = () => {
  const [mainArray, setMainArray] = useState([])
  const [displayArray, setDisplayArray] = useState([])
  const [currentArray, setcurrentArray] = useState([])
  const [currentNumber, setcurrentNumber] = useState('press next to start')
  const [usedNumber, useUsedNumber] = useState([])
  const [disableNext, setDisableNext] = useState(false)

  useEffect(() => {
    const array = []
    const current = []

    for (var i = 0; i < 100; i++) {
      array[i] = { number: i + 1, used: false }
      current[i] = i
    }

    setMainArray(array)
    setcurrentArray(current)
  }, [])

  const splitToChunks = (array, parts) => {
    const result = []
    const arr = [...array]
    for (let i = parts; i > 0; i--) {
      result.push(arr.splice(0, Math.ceil(arr.length / i)))
    }
    return result
  }

  useEffect(() => {
    if (mainArray && mainArray.length > 0) {
      const temp = splitToChunks(mainArray, 10)
      setDisplayArray(temp)
    }
  }, [mainArray])

  const generateIndex = () => {
    setDisableNext(true)
    let index = null
    let i = 0
    while (i < 100) {
      index = currentArray[Math.floor(Math.random() * currentArray.length)]
      if (!usedNumber.includes(index)) {
        setcurrentNumber(index + 1)
        useUsedNumber((usedNumber) => ([...usedNumber, index]))
        return index
      }
      i++
    }
  }

  const getNextNumber = () => {
    if (currentArray && currentArray.length > 0 && usedNumber.length < 101) {
      const index = generateIndex()

      if (index) {
        setDisableNext(false)

        const temp = [...mainArray]
        temp[index] = { ...temp[index], used: true }
        setMainArray(temp)

        const currentArraytemp = [...currentArray]
        currentArraytemp.splice(index, 1)
        setcurrentArray(currentArraytemp)
      }
    }
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-lg-3'>
          <div className='card'>
            <div className='card-body'>
              <h4 className='text-center text-danger'>{currentNumber}</h4>
              <hr />
              <button disabled={disableNext} onClick={getNextNumber} className='btn btn-primary btn-sm btn-block'>Next</button>
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
