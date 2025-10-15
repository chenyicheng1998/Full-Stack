import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    // 修复 Bug 1: 初始状态必须是对象，以匹配 reducer 逻辑
    initialState: {
        message: 'Welcome to the anecdote app!',
        timeoutId: null
    },
    reducers: {
        setNotification(state, action) {
            // action.payload 是一个数组：[message, timeoutId]
            const [message, timeoutId] = action.payload

            // 每次设置新通知时，如果上一个定时器ID存在，先使用 clearTimeout 清除它
            if (state.timeoutId) {
                clearTimeout(state.timeoutId)
            }
            // 返回新的状态对象，包含新的消息和新的定时器ID
            return { message, timeoutId }
        },
        clearNotification(state, action) {
            // 清空消息并将定时器ID设为 null
            return { message: '', timeoutId: null }
        }
    }
})

// 导出同步 Action Creators
export const { setNotification, clearNotification } = notificationSlice.actions

// 导出一个异步 Thunk Action Creator，用于设置带时限的通知
export const setNotificationWithTimeout = (message, time) => {
    return async dispatch => {
        // 1. 设置一个新的定时器
        const timeoutId = setTimeout(() => {
            dispatch(clearNotification())
        }, time * 1000) // time 以秒为单位，转换为毫秒

        // 2. 立即 dispatch 设置通知 action，将消息和定时器ID传递给 reducer
        dispatch(setNotification([message, timeoutId]))
    }
}


export default notificationSlice.reducer