import React, { useState, useRef, useEffect } from 'react';
import classes from './App.module.css';
import Task from '../../Components/Task/Task';
import axios from "../axios-firebase";

import Spinner from "../../Components/ui/Spinner";

function App() {

  // States
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Ref
  const inputRef = useRef('');

  // Cycle de vie
  // Didmount
  useEffect(()=>{
    inputRef.current.focus();

    // Récupérer les taches sur firebase
    fetchTask();

  }, []);

  // Fonctions
  const removeClickedHandler = index => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);

    // Suppression sur firebase
    axios.delete(
        "/task/" + tasks[index].id+".json",
        tasks[index]
    ).then(response=>{
      console.log(response);
    }).catch(error=>{
      console.log(error);
    });
  }

  const doneClickedHandler = index => {
    const newTasks = [...tasks];
    newTasks[index].done = !tasks[index].done;
    setTasks(newTasks);
    // Update task Firebase
    axios.put(
        '/task/'+tasks[index].id+".json",
        tasks[index]
    ).then(response=>{
      console.log(response);
    }).catch(error=>{
      console.log(error);
    });
  }

  const submittedTaskHandler = event => {
    event.preventDefault();
    if (input!=""){
      const newTask = {
        content: input,
        done: false
      };

      axios.post(
          "/task.json", newTask
      ).then(response=>{
        fetchTask();
      }).catch(error=>{
        console.log(error);
      })

     
    }

  }

  const changedFormHandler = event => {
    setInput(event.target.value);
  }

  const fetchTask = ()=>{
    setLoading(true);
    axios.get(
        '/task.json'
    ).then(response=>{
      const tasksArray = [];
      for (let key in response.data){
        tasksArray.push({
          ...response.data[key],
          id: key
        });
      }
      setTasks(tasksArray);
      setLoading(false);
    }).catch(error=>{
      console.log(error);
      setLoading(false);
    });
  }

  // Variables
  let tasksDisplayed = tasks.map((task, index) => (
    <Task
      done={task.done}
      content={task.content}
      key={index}
      removeClicked={() => removeClickedHandler(index)}
      doneClicked={() => doneClickedHandler(index)}
    />
  ));

  return (
    <div className={classes.App}>
      <header>
        <span>TO-DO</span>
      </header>
      {loading ?
            <Spinner />
          :
          <>
            <div className={classes.add}>
              <form onSubmit={(e) => submittedTaskHandler(e)}>
                <input
                    type="text"
                    value={input}
                    ref={inputRef}
                    onChange={(e) => changedFormHandler(e)}
                    placeholder="Que souhaitez-vous ajouter ?"/>
                <button type="submit">
                  Ajouter
                </button>
              </form>
            </div>

          {tasksDisplayed}
        </>
      }
    </div>

  );
}

export default App;
