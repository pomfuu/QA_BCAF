/* eslint-disable no-unused-vars */
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRoutes } from 'react-router-dom';
import Home from './Home';
import Table from './Table';
import InputData from './InputData';

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/input_data",
    element: <InputData />,
  },
];

function App() {
  const route = useRoutes(routes)
  return route
}

export default App
