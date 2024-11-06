import { Routes, Route } from 'react-router-dom'
import { Home, Login} from './containers/public';
import {FlyTicket} from './containers/public'
import { path } from './ultils/constants';


function App() {
  return (
    <div className="h-screen bg-grey">
      <Routes>
        <Route path={path.HOME} element={<Home />} />
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.FLYTCKET} element={<FlyTicket />} />
      </Routes>
    </div>
  );
}

export default App;
