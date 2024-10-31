import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignInPage from './pages/SignInPage/SignInPage.jsx';
import TaskPage from './pages/TasksPage/TasksPage.jsx';
import { AuthProvider } from '../contexts/authContext/index.jsx'; // Adjust path if necessary
import './App.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/tasks" element={<TaskPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
