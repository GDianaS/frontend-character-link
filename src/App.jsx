import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, UserOnlyRoute } from './components/ProtectedRoute';

// Scenes
import Login from './scenes/login';
import Layout from './scenes/layout';
import Home from './scenes/home';
import Works from './scenes/works';
import WorkDetail from './scenes/workDetail';
import WorkCreate from './scenes/workCreate';
import Charts from './scenes/charts';
import Library from './scenes/library';
import About from './scenes/about';

import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="works" element={<Works />} />
          <Route path="works/:id" element={<WorkDetail />} />
          <Route
            path="works/create"
            element={
              <UserOnlyRoute>
                <WorkCreate />
              </UserOnlyRoute>
            }
          />
          <Route path="charts" element={<Charts />} />
          <Route
            path="library"
            element={
              <UserOnlyRoute>
                <Library />
              </UserOnlyRoute>
            }
          />
          <Route path="about" element={<About />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;