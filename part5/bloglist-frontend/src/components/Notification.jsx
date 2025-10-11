const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const className = type ? `notification ${type}` : 'notification'

  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Notification