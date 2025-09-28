const Notification = ({ message }) => {
    if (!message) return null // null, undefined, false 都不显示

    const baseStyle = {
        color: message.type === 'error' ? 'red' : 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    return <div style={baseStyle}>{message.text}</div>
}

export default Notification