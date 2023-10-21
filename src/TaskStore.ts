import { observable, action, makeObservable, configure } from "mobx";

configure({ enforceActions: "always" });

interface Task {
  id: number;
  title: string;
  description: string;
  order_id?: number;
  status: "TODO" | "DONE" | "IN PROGRESS";
  estimate: number;
  created_at: string;
  soft_delete?: boolean;
}

class TaskStore {
  tasks: Task[] = [];

  constructor() {
    makeObservable(this, {
      tasks: observable,
      addTask: action,
      deleteTask: action,
      editTask: action,
      fetchTasks: action,
      searchTasks: action,
    });
  }

  addTask(task: Task) {
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

  deleteTask(taskId: number) {
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

  editTask(taskId: number, updatedTask: Task) {
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

  searchTasks(searchText: string) {
    const lowercasedSearch = searchText.toLowerCase();
    if (lowercasedSearch.trim() === "") {
      this.tasks = taskStore.tasks;
    } else {
      fetch("http://localhost:3001/taskLists")
        .then(response => response.json())
        .then(data => {
          this.tasks = data.filter((task: Task) =>
            task.title.toLowerCase().includes(lowercasedSearch)
          );
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    }
  }
}

const taskStore = new TaskStore();
export default taskStore;
