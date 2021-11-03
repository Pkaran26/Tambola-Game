const { useState, useEffect } = React

const TambolaTicket = () => {
  const [numberOfTicket, setNumberOfTicket] = useState('')
  const [tickets, setTickets] = useState([])
  const [disableForm, setDisableForm] = useState(false)

  const genTicket = () => {
    const ticket = []
    for (let i = 0; i < 3; i++) {
      ticket[i] = []
      for (let j = 0; j < 5; j++) {
        ticket[i][j] = Math.floor(Math.random() * 100)
      }
    }

    for (let i = 0; i < 3; i++) {
      const randomJ = Math.random() * 4
      for (let j = 0; j < parseInt(randomJ); j++) {
        const tempIndex = Math.random() * 4
        ticket[i][parseInt(tempIndex)] = ''
      }
    }
    return ticket
  }

  const generateTickets = (e) => {
    e.preventDefault()
    const tempTickes = []
    for (var i = 0; i < numberOfTicket; i++) {
      const ticket = genTicket()
      tempTickes[i] = {
        ticket_number: i + 1,
        ticket: ticket
      }
    }
    setTickets(tempTickes)
  }

  const printTickets = () => {
    setTimeout(() => {
      window.print()
    }, 100)
  }

  useEffect(() => {
    window.onbeforeprint = () => {
      setDisableForm(true)
    }

    window.onafterprint = () => {
      setDisableForm(false)
    }
  }, [])

  return (
    <div className='container-fluid'>
      <div className='row'>
        {!disableForm ?
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
                    <input type='submit' className='btn btn-info btn-sm btn-block' value='Generate Ticket' />
                  </div>
                </form>

                <hr />
                {tickets && tickets.length > 0 ?
                  <button className='btn btn-primary' onClick={printTickets}>Print</button>
                  : null}
              </div>
            </div>
          </div>
          : null}
        <div className='col-lg-9' id='print'>
          {tickets && tickets.length > 0 ?
            tickets.map((ticket, i) => (
              <table className='table table-bordered' key={i}>
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
