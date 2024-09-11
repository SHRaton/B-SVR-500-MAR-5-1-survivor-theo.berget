import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Coaches from "./pages/Coaches";
import CoacheDetails from "./pages/CoacheDetails";
import Customers from "./pages/Customers";
import Tips from "./pages/Tips";
import Events from "./pages/Events";
import Login from "./pages/Login";
import ClientDetails from "./pages/ClientDetails";
import AddCustomers from "./pages/addCustomers";
import Astro from "./pages/Astro"
import ResultPage from './pages/ResultPage'
import CoachAssign from "./pages/CoachAssign"
import AddCoaches from "./pages/AddCoaches"
import EditCustomers from "./pages/EditCustomers"
import Blog from "./pages/Blog"
import AddBlog from "./pages/AddBlog"

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
            <Route path="/coaches/:id" element={<CoacheDetails />} />
            <Route path="/coaches/:id/assign" element={<CoachAssign />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<ClientDetails />} />
            <Route path="/AddCustomers" element={<AddCustomers /> }/>
            <Route path="/tips" element={<Tips />} />
            <Route path="/events" element={<Events />} />
            <Route path="/astro" element={<Astro />} />
            <Route path="/AddCoaches" element={<AddCoaches />} />
            <Route path="/customers/:id/edit" element={<EditCustomers />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/AddBlog" element={<AddBlog />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
