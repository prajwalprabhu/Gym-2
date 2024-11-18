import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import './style.css';
// import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login/index.js';
import { client } from './client/services.gen';
import Exercise from './pages/Exercise/index.js';
import Graph from './pages/Graph/index.js';
import Signup from './pages/SignUp/index.js';

client.setConfig({
  baseURL: 'http://localhost:8000',
});
// client.instance.interceptors.request.use((config) => {
//   if (config.headers['Content-Type'] === undefined)
//     config.headers.set('Content-Type', 'application/json');
//   return config;
// });
export function App() {
  return (
    <LocationProvider>
      <Header />
      <main>
        <Router>
          <Route
            path="/"
            component={Home}
          />
          <Route
            path="/login"
            component={Login}
          />
          <Route
            path="/exercise"
            component={Exercise}
          />
          <Route
            path="/graph"
            component={Graph}
          />
          <Route
            default
            component={NotFound}
          />
          <Route
            path="/signup"
            component={Signup}
          />
        </Router>
      </main>
    </LocationProvider>
  );
}

render(<App />, document.getElementById('app'));
