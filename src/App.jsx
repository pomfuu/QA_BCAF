/* eslint-disable no-unused-vars */
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRoutes } from 'react-router-dom';
import Home from './Home';
import Table from './Table';

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/table_dashboard",
    element: <Table />,
  },
];

function App() {
  const route = useRoutes(routes)
  return route
}

export default App
