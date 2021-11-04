const JSZip = require('jszip')
const nodeHtmlToImage = require('node-html-to-image')
const imageToBase64 = require('image-to-base64')
const fs = require('fs')

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

const generateTickets = (numberOfTicket) => {
  fs.unlink('./public/tickets.zip', () => { })
  const tempTickes = []
  for (let i = 0; i < numberOfTicket; i++) {
    const ticket = genTicket()
    tempTickes[i] = {
      ticket_number: i + 1,
      ticket: ticket
    }
  }

  return tempTickes
}

const generateHTML = (tickets) => {
  const html = tickets.map((ticket) => {
    return `<html>
      <head>
        <link rel="stylesheet" href="http://localhost:3000/css/bootstrap.min.css" />
        <link rel="stylesheet" href="http://localhost:3000/css/style.css" />
        <style>
          body {
            width: 800px;
            height: 230px;
          }
        </style>
      </head>
      <body>
        <div class="container-fluid">
          <table class="table table-bordered">
            <tr>
              <td colspan="5">
                <strong class="text-info">Ticket Number:</strong> ${ticket.ticket_number}
              </td>
            </tr>
            ${ticket.ticket.map((row) => { return `<tr> ${row.map((e) => { return `<td>${e}</td>` })} </tr>` })}
          </table>
        </div>
      </body>
    </html>`
  })
  return html
}

const createZip = (payload) => {
  const tickets = generateHTML(payload)
  return new Promise((resolve, reject) => {
    const result = tickets.map(async (e, i) => {
      await nodeHtmlToImage({ output: `./public/tickets/Ticket-Number-${i + 1}.png`, html: e, quality: 100 })
      return await imageToBase64(`./public/tickets/Ticket-Number-${i + 1}.png`)
    })

    Promise.all(result)
      .then((res) => {
        const zip = new JSZip()

        if (res && res.length > 0) {
          res.map((e, i) => {
            zip.file(`Ticket-Number-${i + 1}.png`, e, { base64: true })
          })

          zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
            .pipe(fs.createWriteStream('./public/tickets.zip'))
            .on('finish', () => {
              resolve('tickets.zip')
            })
        }
      })
  })
}

module.exports = {
  generateTickets,
  createZip
}
