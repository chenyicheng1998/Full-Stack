import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
            return action.payload
        case 'SET_ERROR':
            return action.payload
        case 'CLEAR_NOTIFICATION':
            return null
        default:
            return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, null)

    return (
        <NotificationContext.Provider value={{ notification, notificationDispatch }}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext
