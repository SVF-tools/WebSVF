import { Outlet } from 'react-router-dom';
import ToastContainer from './components/toast/ToastContainer';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
  return (
    <div className="app-container">
      <Outlet />
      <ToastContainer />
    </div>
  );
}

export default App;
