import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    voteAnecdote(state, action) {
      const anecdote = action.payload
      return state.map(a =>
        a.id !== anecdote.id ? a : anecdote
      )
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteAnecdote, createAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const voteAnecdoteAsync = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    const savedAnecdote = await anecdoteService.updateVote(anecdote.id, updatedAnecdote)
    dispatch(voteAnecdote(savedAnecdote))
  }
}

export default anecdoteSlice.reducer
