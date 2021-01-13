const downloadButton = document.getElementById('download')

const WEEK = 1000 * 60 * 60 * 24 * 7 

const makeEvent = (d, name, title) => {
  const date = new Date(d).toISOString().replace(/[-:]/g, '').split('T')[0]
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0]
  return `BEGIN:VEVENT
UID:${date}-${name}@weekcountical.stefanwehrmeyer.com
DTSTART;VALUE=DATE:${date}
DTSTAMP;VALUE=DATE-TIME:${now}
SUMMARY:${title}
END:VEVENT`
}

downloadButton.addEventListener('click', (e) => {
  e.preventDefault()
  const name = document.querySelector('input[name="name"]').value
  const date = new Date(document.querySelector('input[name="date"]').value)
  const timestamp = date.getTime()
  const weeks = parseInt(document.querySelector('input[name="weeks"]').value)
  const months = parseInt(document.querySelector('input[name="months"]').value)
  const out = []
  for (let month = 1; month < months; month += 1) {
    // Advance date by months
    let d = new Date(date)
    let m = d.getMonth() + month
    let y = Math.floor(m / 12)
    m = m % 12
    d.setMonth(m)
    if (y > 0) {
      d.setFullYear(d.getFullYear() + y)
    }
    out.push(makeEvent(d, name, `${name} month ${month}`))
  }
  for (let week = 1; week < weeks; week += 1) {
    let d = timestamp + WEEK * week
    out.push(makeEvent(d, name, `${name} week ${week}`))
  }

  let calendar = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//weekcountical //stefanwehrmeyer.com//
METHOD:PUBLISH
${out.join('\n')}
END:VCALENDAR
`

  // Trigger download
  const blobConfig = new Blob([calendar], {type: 'text/calendar;charset=utf-8'})
  const blobUrl = URL.createObjectURL(blobConfig);

  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.target = "_blank";
  anchor.download = `weekcount-${name}.ics`;
  anchor.click();

  URL.revokeObjectURL(blobUrl);

})