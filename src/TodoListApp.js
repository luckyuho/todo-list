import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
require("./style/style.css");

const TodoListApp = () => {
  useEffect(() => {
    let section = document.querySelector("section");
    let add = document.querySelector("form button");

    // localStorage
    let myList = localStorage.getItem("list");
    if (myList !== null) {
      let myListArray = JSON.parse(myList);
      myListArray.forEach((item) => {
        createSection(
          item.todoText,
          item.todoMonth,
          item.todoDate,
          item.completeFlag
        );
      });
    }
    add.addEventListener("click", (e) => {
      // prevent form from being submitted
      e.preventDefault();

      // get the input value
      let form = e.target.parentElement;
      let todoText = form.children[0].value;
      let todoMonth = form.children[1].value;
      let todoDate = form.children[2].value;

      if (todoText === "") {
        // alert("Please enter todo affair.");
        return;
      }

      createSection(todoText, todoMonth, todoDate);

      // create an object
      let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate,
      };

      // localStorage
      let myList = localStorage.getItem("list");
      if (myList == null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));
      } else {
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArray));
      }

      form.children[0].value = "";
    });
    function createSection(
      todoText,
      todoMonth,
      todoDate,
      completeFlag = false
    ) {
      // create a todo
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = todoText;
      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerText = todoMonth + " / " + todoDate;

      todo.appendChild(text);
      todo.appendChild(time);

      // create green check and red trash can
      let completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';

      completeButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
      });

      let trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
      trashButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.style.animation = "scaleDown 0.3s forwards";
        todoItem.addEventListener("animationend", () => {
          let myList = localStorage.getItem("list");
          let myListArray = JSON.parse(myList);

          myListArray.forEach((item, index) => {
            if (todoText === item.todoText) {
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });

          todoItem.remove();
        });
      });

      todo.appendChild(completeButton);
      todo.appendChild(trashButton);

      todo.style.animation = "scaleUp 0.3s forwards";

      section.appendChild(todo);
    }

    function mergeTime(arr1, arr2) {
      let result = [];
      let i = 0;
      let j = 0;

      while (i < arr1.length && j < arr2.length) {
        if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
          result.push(arr2[j]);
          j++;
        } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
          result.push(arr1[i]);
          i++;
        } else if (Number(arr1[i].todoMonth) === Number(arr2[j].todoMonth)) {
          if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
            result.push(arr2[j]);
            j++;
          } else {
            result.push(arr1[i]);
            i++;
          }
        }
      }

      while (i < arr1.length) {
        result.push(arr1[i]);
        i++;
      }
      while (j < arr2.length) {
        result.push(arr2[j]);
        j++;
      }

      return result;
    }

    function mergeSort(arr) {
      if (arr.length < 1) {
        return;
      } else if (arr.length === 1) {
        return arr;
      } else {
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
      }
    }

    let sortButton = document.querySelector("div.sort button");
    sortButton.addEventListener("click", () => {
      // sort data
      let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
      localStorage.setItem("list", JSON.stringify(sortedArray));

      // remove section data
      let len = section.children.length;
      for (let i = 0; i < len; i++) {
        section.children[0].remove();
      }

      // load data
      let myList = localStorage.getItem("list");
      if (myList !== null) {
        let myListArray = JSON.parse(myList);
        myListArray.forEach((item) => {
          createSection(
            item.todoText,
            item.todoMonth,
            item.todoDate,
            item.completeFlag
          );
        });
      }
    });
  });

  return (
    <div className="todolist">
      <Helmet>
        <title>{"TodoList Project"}</title>
      </Helmet>
      <main>
        <header>
          <h1>My LocalStorage ToDo List</h1>
        </header>
        <form action="">
          <input type="text" />
          <input type="number" min="1" max="12" placeholder="M" required />
          <input type="number" min="1" max="31" placeholder="D" required />
          <button type="submit">Add into List</button>
        </form>

        <br />
        <br />

        <div class="sort">
          <button type="submit">Sort By Time</button>
        </div>

        <section></section>
      </main>
    </div>
  );
};

export default TodoListApp;
