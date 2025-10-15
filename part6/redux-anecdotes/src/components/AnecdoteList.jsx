import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
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

    const vote = (id, content) => {
        dispatch(voteAnecdote(id))

        // **修复：使用 setNotificationWithTimeout Thunk**
        dispatch(setNotificationWithTimeout(`You voted for "${content}"`, 5))
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
                            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default AnecdoteList

