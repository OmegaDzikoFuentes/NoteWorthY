import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import TasksPage from "../components/TasksPage";
// import Notes from "../components/Notes/Notes";
// import NotesInNotebook from "../components/Notes/NotesInNotebook";
import NoteDetails from "../components/Notes/NoteDetails";
import CreateNoteForm from "../components/Notes/CreateNoteForm";
import UpdateNoteForm from "../components/Notes/UpdateNoteForm";
import UserNotes from "../components/Notes/UserNotes";
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
        path: "notebooks/:notebookId",
        element: <NotebookDetailsPage />,
      },
      {
        path: "notebooks/:notebookId/note/:noteId",
        element: <NoteDetails />
      },
      {
        path: "notes/new",
        element: <CreateNoteForm />,
      },
      {
        path: "notes/:noteId/edit",
        element: <UpdateNoteForm />,
      },
      {
        path: "/notes",
        element: <UserNotes />,
        children: [
          {
            path: ":noteId",
            element: <NoteDetails />,
          }
        ]
      },
      {
        path: "tasks",
        element: <TasksPage />,
      },
    ],
  },
]);
