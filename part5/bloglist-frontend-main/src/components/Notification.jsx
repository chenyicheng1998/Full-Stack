const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const style = {
    background: type === 'success' ? 'lightgreen' : 'lightcoral',
    fontSize: '20px',
    border: `2px solid ${type === 'success' ? 'green' : 'red'}`,
    padding: '10px',
    marginBottom: '10px'
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification