import { Routes, Route, Router } from 'react-router-dom'
import { Home, ResultSeach } from './containers/public';
import { FlyTicket } from './containers/public'
import { path } from './ultils/constants';
import { Login, System, CreateAirport, Airlines, Dashboard, FlightManager, AccountManager, Bookings } from './containers/System'



function App() {
  return (
    <div className="h-screen bg-grey">
      <Routes>
        <Route path={path.HOME} element={<Home />} >
          <Route path={path.FLYTICKET} element={<FlyTicket />} />
          <Route path={path.RESULTSEARCH} element={<ResultSeach />} />
        </Route>


        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.SYSTEM} element={<System />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.FLIGHTMANAGER} element={<FlightManager />} />
          <Route path={path.AIRLINE} element={<Airlines />} />
          <Route path={path.CREATE_AIRPORT} element={<CreateAirport />} />
          <Route path={path.ACCOUNT_MANAGER} element={<AccountManager />}/>
          <Route path={path.BOOKINGS} element={<Bookings />}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
