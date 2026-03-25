import './App.css';
import Addlist from './pages/Todo-Add-List/Addlist';

import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Addlist />}></Route>
    </Routes>
  );
};

export default App;
