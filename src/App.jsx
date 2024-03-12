/* eslint-disable no-unused-vars */
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRoutes } from 'react-router-dom';
import Home from './Home';
import Table from './Table';
import InputData from './InputData';
import Authorization from './Authorization';
import InputContent from './InputContent';

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/input",
    element: 
    <Authorization>
      <InputData />
    </Authorization>
  },
  {
    path: "/login",
    element: <Authorization />,
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
