import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './index.css';
import ToastContainer from './components/toast/ToastContainer';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
  useEffect(() => {
    // Initialize theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <>
      <div className="app-container" style={{ backgroundColor: 'var(--background-color)' }}>
        <Outlet />
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
