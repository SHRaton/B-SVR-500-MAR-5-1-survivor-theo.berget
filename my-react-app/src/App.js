import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Coaches from "./pages/Coaches";
import Customers from "./pages/Customers";
import Tips from "./pages/Tips";
import Events from "./pages/Events";
import Login from "./pages/Login";
import ClientDetails from "./pages/ClientDetails";
import AddCustomers from "./pages/addCustomers";
import Astro from "./pages/Astro"
import ResultPage from './pages/ResultPage'
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/AddCustomers" element={<AddCustomers /> }/>
            <Route path="/tips" element={<Tips />} />
            <Route path="/events" element={<Events />} />
            <Route path="/astro" element={<Astro />} />
            <Route path="/customers/:id" element={<ClientDetails />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
