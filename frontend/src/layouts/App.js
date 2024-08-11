import '../App.css';
import Article from "./pages/articles/Articles";
import Dashboard from './pages/Admin';
import User from "./pages/users/User";
import CreateUser from "./pages/users/CreateUser";
import UpdateUser from "./pages/users/UpdateUser";
import Login from "./pages/Auth/Login";
import Register from './pages/Auth/Register';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateArticle from './pages/articles/CreateArticle';
import EditArticle from './pages/articles/EditArticle';

function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/articles' element={<Article />} />
          <Route path="/users" element={<User />} />
          <Route path="/users/add" element={<CreateUser />} />
          <Route path="/articles/add" element={<CreateArticle />} />
          <Route path="/articles/:id" element={<EditArticle />} />
          <Route path="/users/:id" element={<UpdateUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
