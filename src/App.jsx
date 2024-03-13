/* eslint-disable no-unused-vars */
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRoutes } from 'react-router-dom';
import Home from './Home';
import Table from './Table';
import InputData from './InputData';
import Summary from './Summary';
import Authorization from './Authorization';

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/input",
    element: 
    <Authorization>
      <Home />
    </Authorization>
  },
  {
    path: "/input_data",
    element: <InputData />,
  },
  {
    path: "/summary",
    element: <Summary />,
  }
];

function App() {
  const route = useRoutes(routes)
  return route
}

export default App
