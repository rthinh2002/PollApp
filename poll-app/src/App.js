import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SignIn from './components/SignIn';
import DashBoard from './components/DashBoard';
import NavBar from './components/NavBar';
import QuestionDetails from './components/QuestionDetails';
import AddQuestion from './components/AddQuestion';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <div>
      {isAuthenticated && <NavBar />}
      <Routes>
          <Route exact path="/" element={<SignIn />}></Route>
          <Route exact path="/dashboard" element={<DashBoard />}></Route>
          <Route exact path="/question/:questionId" element={<QuestionDetails />}></Route>
          <Route exact path="/addQuestion" element={<AddQuestion />}></Route>
      </Routes>
    </div>
  );
}

export default App;
