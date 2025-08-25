
function convertDaysToHoursMin(days) {
  const hours = days * 24
  const minutes = Math.round(60 / (1 / ((hours) - (Math.floor(hours)))))
  const formatted = (Math.floor(hours) + ':' + (minutes < 10 ? '0' + minutes : minutes))
  return { hours, minutes, formatted }
}

function formatTime(hourOrMin) {
  if (!hourOrMin) {
    return '00'
  }
  if (hourOrMin < 10) {
    return `0${hourOrMin}`
  }
  return hourOrMin
}

function formatHoursMin(hours, min) {
  if (!hours && !min) {
    return ''
  }
  const hoursFormatted = formatTime(hours)
  const minFormatted = formatTime(min)

  return `${hoursFormatted}:${minFormatted}`
}

export { convertDaysToHoursMin, formatHoursMin }