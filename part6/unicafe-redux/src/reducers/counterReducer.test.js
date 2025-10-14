import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import counterReducer from './counterReducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })

  test('ok is incremented', () => {
    const action = {
      type: 'OK'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0
    })
  })

  test('bad is incremented', () => {
    const action = {
      type: 'BAD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 1
    })
  })

  test('reset works correctly', () => {
    const action = {
      type: 'RESET'
    }
    const state = {
      good: 5,
      ok: 4,
      bad: 2
    }

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual(initialState)
  })

  test('multiple increments work correctly', () => {
    let state = initialState

    // Increment good twice
    deepFreeze(state)
    state = counterReducer(state, { type: 'GOOD' })
    deepFreeze(state)
    state = counterReducer(state, { type: 'GOOD' })

    // Increment ok once
    deepFreeze(state)
    state = counterReducer(state, { type: 'OK' })

    // Increment bad three times
    deepFreeze(state)
    state = counterReducer(state, { type: 'BAD' })
    deepFreeze(state)
    state = counterReducer(state, { type: 'BAD' })
    deepFreeze(state)
    state = counterReducer(state, { type: 'BAD' })

    expect(state).toEqual({
      good: 2,
      ok: 1,
      bad: 3
    })
  })

  test('unknown action type returns current state', () => {
    const action = {
      type: 'UNKNOWN_ACTION'
    }
    const state = {
      good: 3,
      ok: 2,
      bad: 1
    }

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual(state)
  })
})
