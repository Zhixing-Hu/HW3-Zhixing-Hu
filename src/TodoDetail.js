import React, { useContext, useState } from 'react'
import { TodoContext } from './App'

export default function TodoDetail(props) {
    const {handleImportanceChange, handleDeleteTodo, handleProgressChange} = useContext(TodoContext)
    const { 
        id,
        importance,
        done,
        inprogress,
        text
    } = props
    const [startEdit, setStartEdit] = useState(false)
    const [updateImportance, setUpdateImportance] = useState(importance)
    const [editText, setEditText] = useState(text)
    const [prevText, setPrevText] = useState(text)
    

    function handleChange(change) {
        setUpdateImportance(change)
    }

    function handleEdit() {
        setPrevText(editText)
        setStartEdit(true)
    }

    function handleEditText(change){
        setEditText(change)
    }
    function handleEditFinish(event) {
        if(event.key === 'Enter') {
            setStartEdit(false)
        }
    }
    function handleCancelEdit() {
        setEditText(prevText)
        setStartEdit(false)
    }

  return (
    <div>
        <input 
            value={updateImportance} 
            onChange={e => handleChange(e.target.value)}
            onBlur={() => handleImportanceChange(id, updateImportance)}
            type='number'
            min='0'
            />
        {startEdit?
            <input 
                value={editText}
                onChange={e => handleEditText(e.target.value)}
                onKeyDown={handleEditFinish}
            /> : <span className={done?'done':'inprogress'} onClick={() => handleProgressChange(id)}>{editText}</span>}
        <button disabled={startEdit} onClick={handleEdit}>Edit</button>
        <button disabled={!startEdit} onClick={handleCancelEdit}>Cancel</button>
        <button onClick={() => handleDeleteTodo(id)}>delete</button>
    </div>
  )
}
