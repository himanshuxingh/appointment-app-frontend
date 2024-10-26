import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserRegister } from './components/user-register';
import { UserLogin } from './components/user-login';
import { UserDashboard } from './components/user-dashboard';
import { AddTask } from './components/add-task';
import { EditTask } from './components/edit-task';
import { UserError } from './components/user-error';
import { ToDoHome } from './components/to-do-home';

function App() {
  return (
    <div className="container-fluid to-do-background">
      <BrowserRouter>
        <section>
          <Routes>  
            <Route path='/' element={<ToDoHome />} />
            <Route path='register' element={<UserRegister />} />
            <Route path='login' element={<UserLogin />} />
            <Route path='dashboard' element={<UserDashboard />} />
            <Route path='add-task' element={<AddTask />} />
            <Route path='edit-task/:appointmentId' element={<EditTask />} />
            <Route path='error' element={<UserError />} />
            <Route path='*' element={<UserError/>}></Route>
          </Routes>
        </section>
      </BrowserRouter>
    </div>
  );
}

export default App;
