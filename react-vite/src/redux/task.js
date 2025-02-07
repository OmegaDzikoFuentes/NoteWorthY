import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

// Action Types
const LOAD_TASKS = "tasks/loadTasks";

// Action Creators
const loadTasks = (tasks) => {
  return {
    type: LOAD_TASKS,
    tasks,
  };
};

// Thunks
export const getUserTasks = () => async (dispatch) => {
  const response = await csrfFetch("/api/tasks/current");

  if (response.ok) {
    const data = await response.json();
    const tasks = data.Tasks;
    dispatch(loadTasks(tasks));
  } else {
    return await response.json();
  }
};

// Reducer
const initialState = { userTasks: {} };

function tasksReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_TASKS: {
      const userTasks = {};
      action.tasks.forEach((task) => {
        userTasks[task.id] = task;
      });
      return { ...state, userTasks };
    }
    default:
      return state;
  }
}

// Selectors
export const selectUserTasks = (state) =>
  state.task?.userTasks || initialState.userTasks;

export const selectAllUserTasks = createSelector([selectUserTasks], (tasks) => {
  return Object.values(tasks);
});

export default tasksReducer;
