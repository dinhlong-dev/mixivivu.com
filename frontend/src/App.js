import { Routes, Route } from 'react-router-dom'
import { Home, ResultSeach } from './containers/public';
import { FlyTicket } from './containers/public'
import { path } from './ultils/constants';
import { Login, System, CreateAirport } from './containers/System'



function App() {
  return (
    <div className="h-screen bg-grey">
      <Routes>
        <Route path={path.HOME} element={<Home />} >
          <Route path={path.FLYTICKET} element={<FlyTicket />} />
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.RESULTSEARCH} element={<ResultSeach />} />
        </Route>


        <Route path={path.SYSTEM} element={<System />}>
          <Route path={path.CREATE_AIRPORT} element={<CreateAirport />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
