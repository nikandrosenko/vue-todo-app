<template>
  <div class="wrapper-todo">
    <div class="title has-text-centered">My ToDo List!</div>
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
          <button :disabled="!newtodoContent" class="button is-info">
            Add
          </button>
        </p>
      </div>
    </form>
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
              {{ todo.content }}
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
import { v4 as uuidv4 } from "uuid";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

// todos
const todos = ref([
  // {
  //   id: "id1",
  //   content: "hello guys",
  //   done: false,
  // },
  // {
  //   id: "id2",
  //   content: "check me!",
  //   done: true,
  // },
]);

// get todos:
onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "todos"));
  let fbTodos = [];
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    const todo = {
      id: doc.id,
      content: doc.data().content,
      done: doc.data().done,
    };
    fbTodos.push(todo);
  });
  todos.value = fbTodos;
});

// add todo
const newtodoContent = ref("");

const addTodo = () => {
  const newTodo = {
    id: uuidv4(),
    content: newtodoContent.value,
    done: false,
  };
  todos.value.unshift(newTodo);
  newtodoContent.value = "";
};

// delete todo
const deleteTodo = (id) => {
  todos.value = todos.value.filter((todo) => todo.id !== id);
};

// toggle done

const toggleDone = (id) => {
  const index = todos.value.findIndex((todo) => todo.id === id);
  todos.value[index].done = !todos.value[index].done;
};
</script>

<style>
@import "bulma/css/bulma.min.css";

.wrapper-todo {
  max-width: 400px;
  padding: 20px;
  margin: 0 auto;
}
.line-through {
  text-decoration: line-through;
}
</style>
