import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Notes from '../components/Notes/Notes';
import CreateNoteForm from '../components/Notes/CreateNoteForm';

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
      // {
      //   path: "notes/:noteId",
      //   element: <Notes />,
      // },
      {
        path: "notes",
        element: <CreateNoteForm />
      }
    ],
  },
]);