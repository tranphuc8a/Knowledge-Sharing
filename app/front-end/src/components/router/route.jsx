import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../../App";

class MyRoute extends React.Component{

    render(){
        return ( <Router> <Routes>
            
            // Màn mặc định của app
            <Route exact 
                path="/" 
                element={<App />} 
            />

            // Màn trang chủ
            <Route 
                path="/home"  
                element={<p> Màn home </p>} 
            />

        </Routes> </Router> );
    }
}


export default MyRoute;