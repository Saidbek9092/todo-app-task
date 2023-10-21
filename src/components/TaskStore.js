import { observable, action, makeObservable, configure } from "mobx";

configure({ enforceActions: "always" });

class TaskStore {
  tasks = [];

  constructor() {
    makeObservable(this, {
      tasks: observable,
      addTask: action,
      deleteTask: action,
      editTask: action,
      fetchTasks: action,
    });
  }

  addTask(task) {
    this.tasks.push(task);

    fetch("http://localhost:3001/taskLists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
      .then(response => response.json())
      .then(data => {})
      .catch(error => {
        console.error("Error adding a new task:", error);
      });
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);

    fetch(`http://localhost:3001/taskLists/${taskId}`, {
      method: "DELETE",
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error deleting task");
        }
      })
      .catch(error => {
        console.error("Error deleting task:", error);
      });
  }

  editTask(taskId, updatedTask) {
    const index = this.tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
      this.tasks[index] = updatedTask;

      fetch(`http://localhost:3001/taskLists/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Error updating task");
          }
        })
        .catch(error => {
          console.error("Error updating task:", error);
        });
    }
  }

  fetchTasks() {
    return fetch("http://localhost:3001/taskLists")
      .then(response => response.json())
      .then(data => {
        this.tasks = data;
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }
}

const taskStore = new TaskStore();
export default taskStore;
