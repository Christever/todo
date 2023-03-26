import axios from "axios";

const instance = axios.create({
    baseURL:'https://todo-1e459-default-rtdb.europe-west1.firebasedatabase.app/'
});

export default instance;