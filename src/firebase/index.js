import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCw8EDHOQlkm-OXA0MkSafXZD9_j_Odqik",
  authDomain: "todo-vue-app-93886.firebaseapp.com",
  projectId: "todo-vue-app-93886",
  storageBucket: "todo-vue-app-93886.appspot.com",
  messagingSenderId: "98716182363",
  appId: "1:98716182363:web:2e559099342f05aab99c7e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
