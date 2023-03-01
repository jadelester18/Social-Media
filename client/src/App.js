import './App.css';
import {
  BrowserRouter,
  Route,
  Routes,
  Switch,
  Navigate,
} from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Verifyemail from './pages/Verifyemail';
import Forgetpassword from './pages/Forgetpassword';
import Resetpassword from './pages/Resetpassword';
import PageNotFound from './pages/PageNotFound';
import Login from './pages/Login';
import { useSelector } from 'react-redux';

function App() {
  const userLoggedinDetails = useSelector((state) => state.user);
  let user = userLoggedinDetails.user;
  // console.log(user);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={`/Profile/:id`} element={<Profile />} />
          <Route
            path="/login"
            element={user !== null ? <Navigate to={'/'} /> : <Login />}
          />
          <Route path="/signup" element={<Register />} />
          <Route path="/verify/email" element={<Verifyemail />} />
          <Route path="/forgot/password" element={<Forgetpassword />} />
          <Route path="/reset/password" element={<Resetpassword />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
