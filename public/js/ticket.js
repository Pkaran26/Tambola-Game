const { useState, useEffect } = React

const TambolaTicket = () => {
  const [numberOfTicket, setNumberOfTicket] = useState('')
  const [tickets, setTickets] = useState([])
  const [msg, setMsg] = useState('')
  const [disableBtn, setDisableBtn] = useState(false)

  const generateTickets = async (e) => {
    e.preventDefault()

    const result = await axios.get(`/generate-ticket/${numberOfTicket}`)
      .catch((err) => { return err.response })

    if (result && result.data && result.data.length > 0) {
      setTickets(result.data)
    }
  }

  const printTickets = async () => {
    setDisableBtn(true)
    setMsg('start zipping...')
    const result = await axios.post('/generate-zip', tickets)
      .catch((err) => { return err.response })

    if (result.data) {
      setMsg('start downloading...')

      const element = document.createElement('a');
      element.setAttribute('href', `/${result.data.filename}`)
      element.setAttribute('download', '')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      setDisableBtn(false)
      setMsg('')
      setNumberOfTicket('')
      setTickets([])
    }
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-lg-3'>
          <div className='card'>
            <div className='card-body'>
              <form onSubmit={generateTickets}>
                <div className='form-group'>
                  <label>No. of Tickets</label>
                  <input
                    type='number'
                    onChange={(e) => {
                      let value = e.target.value
                      if (value && value.length > 0) {
                        value = parseInt(value)
                        if (value > 0) {
                          setNumberOfTicket(value)
                        }
                      } else {
                        setNumberOfTicket()
                      }
                    }} value={numberOfTicket} required className='form-control'
                  />
                </div>
                <div className='form-group'>
                  <input type='submit' disabled={disableBtn} className='btn btn-info btn-sm btn-block' value='Generate Ticket' />
                </div>
              </form>
              <hr />
              {tickets && tickets.length > 0 ?
                <button className='btn btn-primary' disabled={disableBtn} onClick={printTickets}>Download Tickets</button>
                : null}
              <span>&nbsp;&nbsp;{msg}</span>
            </div>
          </div>
        </div>
        <div className='col-lg-9'>
          {tickets && tickets.length > 0 ?
            tickets.map((ticket, i) => (
              <table className='table table-bordered' id={`img_${i}`} key={i}>
                <tbody>
                  <tr>
                    <td colSpan='5'>
                      <strong className='text-info'>Ticket Number:</strong> {ticket.ticket_number}
                    </td>
                  </tr>
                  {ticket.ticket.map((row, j) => (
                    <tr key={j}>
                      {row.map((e, k) => (
                        <td key={k}>{e}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ))
            : null}
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(<TambolaTicket />, document.getElementById('root'))
