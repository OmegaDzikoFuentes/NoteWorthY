import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import TasksPage from "../components/TasksPage";
import Notes from "../components/Notes/Notes";
import NoteDetails from "../components/Notes/NoteDetails";
import CreateNoteForm from "../components/Notes/CreateNoteForm";
import UpdateNoteForm from "../components/Notes/UpdateNoteForm";
import NotebookPage from '../components/NotebookPage/NoteBook';
import NotebookDetailsPage from '../components/NotebookDetailPage/NotebookDetailsPage';

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
        path: "notebooks",
        element: <NotebookPage />,
      },
      {
        path: "/notebooks/:notebookId",  
        element: <NotebookDetailsPage />,
        // added this so notes can be nested into notebooks
        children: [
          {
            path: "ntoes",
            element: <Notes />
          }
        ]
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
        path: "notes/:noteId/edit",
        element: <UpdateNoteForm />,
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
