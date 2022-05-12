import React from "react";
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/global.css";

import AddBlog from "./components/AddBlog";
import Blog from "./components/Blog";
import BlogsList from "./components/BlogsList";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (	
	 <Router>
     <Navbar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<BlogsList/>} />
          <Route path="/blogs" element={<BlogsList/>} />
          <Route path="/add" element={<AddBlog/>} />
          <Route path="/blogs/:id" element={<Blog/>} />
        </Routes>
      </div>
	 <Footer />	  
	</Router>    
  );
}

export default App;
