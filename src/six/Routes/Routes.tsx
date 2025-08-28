import { createHashRouter } from 'react-router-dom';
import App from '../App';
import GraphsPage from '../pages/graphs/graphsPage';
import RouteErrorElement from '../components/RouteErrorElement';

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteErrorElement />,
    children: [
      {
        path: '',
        element: <GraphsPage />, // Default path with no session ID
        errorElement: <RouteErrorElement />,
      },
      {
        path: 'session/:sessionId', // Path with session ID parameter
        element: <GraphsPage />,
        errorElement: <RouteErrorElement />,
      },
    ],
  },
]);
