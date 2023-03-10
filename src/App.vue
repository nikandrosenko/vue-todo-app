<template>
  <div class="wrapper-todo">
    <div class="title has-text-centered has-text-light">My ToDo List!</div>
    <form @submit.prevent="addTodo">
      <div class="field is-grouped mb-5">
        <p class="control is-expanded">
          <input
            v-model="newtodoContent"
            class="input"
            type="text"
            placeholder="Add to do"
          />
        </p>
        <p class="control">
          <button :disabled="!newtodoContent" class="button is-light">
            Add
          </button>
        </p>
      </div>
    </form>
    <div class="is-flex is-justify-content-space-between">
      <button
        @click="showOnly('done')"
        class="button is-success mb-5 mr-5 is-fullwidth"
      >
        Done
      </button>
      <button
        @click="showOnly('open')"
        class="button is-info mb-5 mr-5 is-fullwidth"
      >
        Open
      </button>
      <button @click="showOnly()" class="button is-light mb-5 is-fullwidth">
        All
      </button>
    </div>
    <div
      v-for="todo in todos"
      :ker="todo.id"
      class="card mb-5"
      :class="{ 'has-background-success-light': todo.done }"
    >
      <div class="card-content">
        <div class="content">
          <div class="columns is-mobile is-vcentered">
            <div
              class="column"
              :class="{ 'has-text-success line-through': todo.done }"
            >
              {{ todo.content }} {{ todo.date }}
            </div>
            <div class="column is-5 has-text-right">
              <button
                @click="toggleDone(todo.id)"
                class="button"
                :class="todo.done ? 'is-success' : 'is-light'"
              >
                &check;
              </button>
              <button
                @click="deleteTodo(todo.id)"
                class="button is-danger ml-2"
              >
                &cross;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import
import { ref, onMounted } from "vue";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";

// firebase ref
const todosCollectionRef = collection(db, "todos");

const todosCollectionQuery = query(todosCollectionRef, orderBy("date", "desc"));

// todos
const todos = ref([]);
const todosBack = ref([]);

// get todos
onMounted(() => {
  onSnapshot(todosCollectionQuery, (querySnapshot) => {
    const fbTodos = [];
    querySnapshot.forEach((doc) => {
      const todo = {
        id: doc.id,
        content: doc.data().content,
        done: doc.data().done,
      };
      fbTodos.push(todo);
    });
    todos.value = fbTodos;
    todosBack.value = fbTodos;
  });
});

// add todo
const newtodoContent = ref("");
const addTodo = () => {
  addDoc(todosCollectionRef, {
    content: newtodoContent.value,
    done: false,
    date: Date.now(),
  });
  newtodoContent.value = "";
};

// delete todo
const deleteTodo = (id) => {
  deleteDoc(doc(todosCollectionRef, id));
};

// toggle done
const toggleDone = (id) => {
  const index = todos.value.findIndex((todo) => todo.id === id);
  updateDoc(doc(todosCollectionRef, id), {
    done: !todos.value[index].done,
  });
};
// show only by status
const showOnly = (status) => {
  if (status === "done") {
    todos.value = todosBack.value;
    todos.value = todos.value.filter((todo) => todo.done);
  } else if (status === "open") {
    todos.value = todosBack.value;
    todos.value = todos.value.filter((todo) => !todo.done);
  } else {
    todos.value = todosBack.value;
  }
};
</script>

<style>
@import "bulma/css/bulma.min.css";

body {
  min-height: 100vh;
  background-color: #333;
}
.wrapper-todo {
  max-width: 400px;
  padding: 20px;
  margin: 0 auto;
}
.line-through {
  text-decoration: line-through;
}
</style>
