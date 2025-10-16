import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        clearNotification(state, action) {
            return ''
        }
    }
})

export const { setNotification, clearNotification } = notificationSlice.actions

export const setNotificationWithTimeout = (message, time) => {
    return async dispatch => {
        dispatch(setNotification(message))
        setTimeout(() => {
            dispatch(clearNotification())
        }, time * 1000)
    }
}

export default notificationSlice.reducer