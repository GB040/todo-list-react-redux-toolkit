import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/ todos?_limit=10');

      if (!response.ok) {
        throw new Error('Server Error')
      }

      const data = await response.json();

      return data;  
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    todos: [],
    status: null,
    error: null,
  },
  reducers: {
    addTodo(state, action) { 
      state.todos.push({
        id: new Date().toISOString(),
        title: action.payload.title,
        completed: false,
      });
    },
    removeTodo(state, action) {
      state.todos = state.todos.filter(todo => todo.id !== action.payload.id)
    },
    toggleTodoComplete(state, action) {
      const toggleTodo = state.todos.find(todo => todo.id === action.payload.id);
      toggleTodo.completed = !toggleTodo.completed;
    },
  },
  // extraReducer: {
  //   [fetchTodos.pending]: (state) => {
  //     state.status = 'loading';
  //     state.error = null;
  //   },
  //   [fetchTodos.fulfilled]: (state, action) => {
  //     state.status = 'resolved';
  //     state.todos = action.payload;
  //     console.log(action.payload);
  //   },
  //   [fetchTodos.rejected]: (state, action) => { },
  // },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.status = 'resolved';
      state.todos = action.payload;
    });
    builder.addCase(fetchTodos.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = action.payload;
    });
  },
});

export const { addTodo, removeTodo, toggleTodoComplete } = todoSlice.actions;
export default todoSlice.reducer;