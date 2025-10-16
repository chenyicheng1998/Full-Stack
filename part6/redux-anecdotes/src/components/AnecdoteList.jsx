import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdoteAsync } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(({ filter, anecdotes }) => {
        if (filter === '') {
            return anecdotes
        }
        return anecdotes.filter(anecdote =>
            anecdote.content.toLowerCase().includes(filter.toLowerCase())
        )
    })

    const vote = (anecdote) => {
        dispatch(voteAnecdoteAsync(anecdote))
        dispatch(setNotificationWithTimeout(`You voted for "${anecdote.content}"`, 5))
    }

    return (
        <div>
            {[...anecdotes]
                .sort((a, b) => b.votes - a.votes)
                .map(anecdote => (
                    <div key={anecdote.id}>
                        <div>{anecdote.content}</div>
                        <div>
                            has {anecdote.votes}
                            <button onClick={() => vote(anecdote)}>vote</button>
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default AnecdoteList

