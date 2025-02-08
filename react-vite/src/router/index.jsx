import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import TasksPage from "../components/TasksPage";
import Notes from "../components/Notes/Notes";
import NoteDetails from "../components/Notes/NoteDetails";
import CreateNoteForm from "../components/Notes/CreateNoteForm";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "notes/current",
        element: <Notes />,
      },
      {
        path: "notes/:noteId",
        element: <NoteDetails />,
      },
      {
        path: "notes",
        element: <CreateNoteForm />,
      },
      {
        path: "tasks",
        element: <TasksPage />,
      },
    ],
  },
]);
