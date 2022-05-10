import './App.css';
import React, {useEffect, useState} from 'react'
import TodoDetail from './TodoDetail';

export const TodoContext = React.createContext()
function App() {
  const [todoList, setTodoList] = useState([])
  const [singleTask, setSingleTask] = useState('')
  const [showInProgress, setShowInProgress] = useState(false)
  const [showDone, setShowDone] = useState(false)
  const [showAll, setShowAll] = useState(true)
  const [currTask, setCurrTask] = useState(todoList)
  const [searchKey, setSearchKey] = useState('')

  useEffect(() => {
    let temp = [...todoList]
    if(showInProgress) {
      temp = [...todoList].filter(todo => todo.inprogress === true)
    }else if (showDone) {
      temp = [...todoList].filter(todo => todo.done === true)
    }
    setCurrTask(temp)
  }, [showDone, showAll, showInProgress, todoList])

  function handleSearch(string, pattern) {
    let count = 0;
    for (let i = 0; i < string.length; i++) {
      for (let j = 0; j < pattern.length; j++) {
        if (pattern[j] !== string[i + j]) break;
        if (j === pattern.length - 1) count++;
      }
    }
    return count > 0;
  }

  function handleInputTask(event) {
    if (event.key === 'Enter') {
      let temp = {
        id: Date.now(),
        importance: 1,
        done: false,
        inprogress: true,
        text: singleTask,
      }
      setTodoList([...todoList, temp])
      handleTaskChange('')
    }
  }
  function handleTaskChange(change) {
    setSingleTask(change)
  }

  function handleImportanceChange(id, importance) {
    let temp = [...todoList]
    const index = temp.findIndex(r => r.id === id)
    temp[index].importance = importance
    temp.sort((a, b) => a.importance - b.importance)
    setTodoList(temp)
  } 

  function handleDeleteTodo(id) {
    let temp = [...todoList]
    setTodoList(temp.filter(todo => todo.id !== id))
  }

  function handleProgressChange(id) {
    let temp = [...todoList]
    const index = temp.findIndex(t => t.id === id)
    temp[index].inprogress = !temp[index].inprogress
    temp[index].done = !temp[index].done
    console.log(temp)
    setTodoList(temp)
  }

  function handleProgressPage() {
    setShowInProgress(true)
    setShowDone(false)
    setShowAll(false)
  }
  function handleDonePage() {
    setShowInProgress(false)
    setShowDone(true)
    setShowAll(false)
  }
  function handleAllPage() {
    setShowInProgress(false)
    setShowDone(false)
    setShowAll(true)
    setCurrTask(todoList)
  }

  const todoContextValue = {
    handleImportanceChange,
    handleDeleteTodo,
    handleProgressChange
  }

  function handleSearchChange(change) {
    setSearchKey(change)
  }
  function handleSearchResult(event) {
    if(event.key === 'Enter') {
      
      let temp = [...currTask]
      const res = temp.filter(todo => handleSearch(todo.text, searchKey))
      console.log(res)
      setCurrTask(res)
      setSearchKey('')
    }
  }
  
  return (
    <div>
      {todoList.length > 0? 
        <TodoContext.Provider value = {todoContextValue}>
          <div>
            <input 
              placeholder='Search the to do list' 
              onChange={e => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchResult}
              value={searchKey}
            />
            {
              currTask.map((todo) => (
                <TodoDetail 
                  key={todo.id}
                  {...todo}
                />
              ))
            }
            <div>
              <button className={showAll?'show':'notshow'} onClick={handleAllPage}>All</button>
              <button className={showInProgress?'show':'notshow'} onClick={handleProgressPage}>In Progress</button>
              <button className={showDone?'show':'notshow'} onClick={handleDonePage}>Done</button>
            </div>
          </div>
        </TodoContext.Provider>
        
        : <h1>Come On</h1>}
        
      <input 
        placeholder='Enter your todo'
        onChange={(e) => handleTaskChange(e.target.value)}
        onKeyDown={handleInputTask}
        value={singleTask}
      ></input>
      
    </div>
  );
}

export default App;
