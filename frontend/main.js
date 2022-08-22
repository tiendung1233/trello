window.addEventListener("DOMContentLoaded", start);
const todoAPI = "http://localhost:5035/api/courses";

let newData = [];

function start() {
  getTodo(renderTodo);
  hanldeCreateTodoBox();
}

start();
window.addEventListener("load", (event) => {
  console.log("page is fully loaded");
});
function getTodo(callback) {
  fetch(todoAPI)
    .then((response) => response.json())
    .then(callback);
}

function createTodoBox(data, callback) {
  let option = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(todoAPI, option)
    .then((response) => response.json())
    .then(callback);
}

function handleTodoItem(e) {
  e.preventDefault();
  const idTodo = e.target.id.substring(5);
  const elBoxCon = document.getElementById("box_content-" + idTodo);
  const elTodoInput = document.getElementById("new-todo-input-" + idTodo).value;

  let index = newData.findIndex((e) => {
    return e._id === idTodo;
  });
  const oldData = newData[index].todoItem;
  let option = {
    name: elTodoInput,
  };

  fetch(todoAPI + "/" + idTodo, {
    method: "PATCH",
    body: JSON.stringify({
      todoItem: [option, ...oldData],
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => start());
  document.getElementById("new-todo-input-" + idTodo).value = "";
}
function deleteTodo(data, idTodoItem, idTodo) {
  let datatodo = [];
  data.Course.todoItem.map((todo) => {
    datatodo.push(todo);
  });
  newData = datatodo.filter((data, index) => data["_id"] !== idTodoItem);

  console.log(newData);
  fetch(todoAPI + "/" + idTodo, {
    method: "PATCH",
    body: JSON.stringify({
      todoItem: newData,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => json);
  start();
}

function handleEdit(e) {
  const todoEditEl = e.target;
  todoInput = todoEditEl.closest(".todo").childNodes[1].children[0];
  if (todoEditEl.innerText.toLowerCase() == "edit") {
    todoEditEl.innerText = "Save";
    todoInput.removeAttribute("readonly");
    todoInput.focus();
  } else {
    todoEditEl.innerText = "Edit";
    todoInput.setAttribute("readonly", "readonly");
    const todoItem = todoEditEl
      .closest(".box_content")
      .querySelectorAll(".box");
    console.log(todoItem);
  }
}

function handleDelete(e) {
  const idTodo = e.target.closest(".box").id.substring(4);
  const idTodoItem = e.target.closest(".todo").id.substring(10);
  fetch(todoAPI + "/" + idTodo)
    .then((response) => response.json())
    .then((data) => deleteTodo(data, idTodoItem, idTodo));
}

function handleDragStart(e) {
  const check = e.target.className;
  const dragTodoBox = e.target;
  const idTodo = e.target.parentElement.parentElement.id.substring(4);
  if (check == "todo-box") {
    dragTodoBox.classList.add("dragging-box");
  }
  if (check == "todo") {
    dragTodoBox.classList.add("dragging");
  }
  //    console.log(e.target)
  const tableTodos = e.target.parentElement.querySelectorAll(
    ".todo:not(.dragging)"
  );
  const todoItem = [];
  tableTodos.forEach((tableTodo) => {
    todoItem.push({
      name: tableTodo.childNodes[1].childNodes[1].value,
    });
  });
  //    console.log(todoItem)

  fetch(todoAPI + "/" + idTodo, {
    method: "PATCH",
    body: JSON.stringify({
      todoItem: todoItem,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => json);
}
function handleDragEnd(e) {
  const dragTodoBox = e.target;
  dragTodoBox.classList.remove("dragging-box");
  dragTodoBox.classList.remove("dragging");
  const updataTodos = document.querySelectorAll(".box");
  // updataTodos.forEach((updataTodo,index) =>{
  //     idTodo = updataTodo.id.substring(4)

  //     fetch(todoAPI+"/"+idTodo, {
  //         method: 'PATCH',
  //         body: JSON.stringify({
  //             index:index
  //         }),
  //     headers: {
  //         'Content-type': 'application/json; charset=UTF-8',
  //     },

  // })
  //   .then((response) => response.json())
  //   .then((json) =>   json
  //  );
  // })

  const idTodos = e.target.parentElement.parentElement.id.substring(4);
  const tableTodos = e.target.parentElement.querySelectorAll(".todo");
  console.log(tableTodos);
  const todoItem = [];
  tableTodos.forEach((tableTodo) => {
    todoItem.push({
      name: tableTodo.childNodes[1].childNodes[1].value,
    });
  });
  fetch(todoAPI + "/" + idTodos, {
    method: "PATCH",
    body: JSON.stringify({
      todoItem: todoItem,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => json);
}

function handleDragOver() {
  const elAppTodo = document.getElementById("app-todo");
  elAppTodo.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragTodoBox = document.querySelector(".dragging-box");
    // updateDragTodo(dragTodoBox)

    const dragTodo = document.querySelector(".dragging");

    const targetBoxConten = e.target.closest(".box_content");
    //drag todo box
    if (dragTodoBox) {
      const afterElement = getDragAfterElement(elAppTodo, e.clientX);

      if (afterElement == null) {
        elAppTodo.appendChild(dragTodoBox);
      } else {
        elAppTodo.insertBefore(dragTodoBox, afterElement);
      }
    }
    //drag todo item
    if (dragTodo) {
      const afterElementTodo = getDragAfterElementTodo(
        targetBoxConten,
        e.clientY
      );

      if (afterElementTodo == null) {
        targetBoxConten.appendChild(dragTodo);
      } else {
        targetBoxConten.insertBefore(dragTodo, afterElementTodo);
      }
    }
  });
}
// get after element todo item drag
handleDragOver();
function getDragAfterElementTodo(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".todo:not(.dragging)"),
  ];
  // console.log(draggableElements)
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// get after elemnt todo drag
function getDragAfterElement(container, x, y) {
  const draggableElements = [
    ...container.querySelectorAll(".todo-box:not(.dragging-box)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offsetX = x - box.left - box.width / 2;
      if (offsetX < 0 && offsetX > closest.offset) {
        return { offset: offsetX, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function renderTodo(todos) {
  const elListTodo = document.querySelector("#app-todo");
  newData = todos.Course.slice(0, todos.Course.length);
  let htmls = "";

  todos.Course.sort((a, b) => {
    return a.index - b.index;
  }).map((todo) => {
    htmls += `<div class="todo-box" id="todo-box-${todo._id}" draggable="true" ondragstart = "handleDragStart(event)" ondragend ="handleDragEnd(event)">
                    <div class="box" id="box-${todo._id}">
                        Todo Name: ${todo.todo}
                        <form class="new-todo-form" id="form-${todo._id}"   onsubmit="handleTodoItem(event)" >
                            <input class="new-todo-input" type="text" placeholder="Input todo"
                                id="new-todo-input-${todo._id}">
                            <input class="new-todo-submit" type="submit" name ="cre-todo-item" value="Add todo" id="new-todo-submit-${todo._id}"
                                readonly="readonly">
                        </form>
                        <div class="box_content" id="box_content-${todo._id}">
                       
                        </div>
                    </div>
                </div>`;
  });

  elListTodo.innerHTML = htmls;

  todos.Course.map((todo) => {
    let htmlsTodo = "";
    todo.todoItem.map((todoItem) => {
      htmlsTodo += `
               <div class="todo" id="todo-item-${todoItem._id}" draggable="true" ondragstart = "handleDragStart(event)" ondragend ="handleDragEnd(event)">
                <div class="content">
                    <input class="text" value =${todoItem.name} type="text" readonly="readonly"/>
                </div>
                <div class="actions">
                    <button class="edit" onclick = "handleEdit(event)">Edit</button>
                    <button class="delete" onclick="handleDelete(event)">Delete</button>
                </div>
             </div>  
              `;
    });
    const boxContent = document.querySelector("#box_content-" + todo._id);
    boxContent.innerHTML = htmlsTodo;
  });
}

function hanldeCreateTodoBox() {
  const elAddTodo = document.querySelector("#creat-todo-app");

  elAddTodo.addEventListener("submit", (e) => {
    const index = document.querySelectorAll(".box").length;
    // console.log(index)
    e.preventDefault();
    const todo = document.querySelector('input[name ="name-todo-box"]').value;
    const formData = {
      todo: todo,
      todoItem: [],
      index: index,
    };
    createTodoBox(formData, function () {
      getTodo(renderTodo);
    });

    console.log(name);
    document.querySelector('input[name ="name-todo-box"]').value = "";
  });
}
