import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import counterReducer from './reducers/counterReducer'

const store = createStore(counterReducer)

const App = () => {
  const state = store.getState()

  return (
    <div>
      <div>
        <button onClick={() => store.dispatch({ type: 'GOOD' })}>good</button>
        <button onClick={() => store.dispatch({ type: 'OK' })}>ok</button>
        <button onClick={() => store.dispatch({ type: 'BAD' })}>bad</button>
        <button onClick={() => store.dispatch({ type: 'RESET' })}>reset stats</button>
      </div>
      <div>good {state.good}</div>
      <div>ok {state.ok}</div>
      <div>bad {state.bad}</div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
