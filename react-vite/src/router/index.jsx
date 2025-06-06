import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import TasksPage from "../components/TasksPage";
import NotesInNotebook from "../components/Notes/NotesInNotebook";
import CreateNoteForm from "../components/Notes/CreateNoteForm";
import UserNotes from "../components/Notes/UserNotes";
import NotebookPage from "../components/NotebookPage/NoteBook";
import HomePage from "../components/HomePage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
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
        path: "notebooks",
        element: <NotebookPage />,
      },
      {
        path: "notebooks/:notebookId",
        element: <NotesInNotebook />,
      },
      {
        path: "notebooks/:notebookId/note/:noteId",
        element: <NotesInNotebook />,
      },
      {
        path: "notes/new",
        element: <CreateNoteForm />,
      },
      {
        path: "/notes",
        element: <UserNotes />,
      },
      {
        path: "/notes/:noteId",
        element: <UserNotes />,
      },
      {
        path: "tasks",
        element: <TasksPage />,
      },
    ],
  },
]);
