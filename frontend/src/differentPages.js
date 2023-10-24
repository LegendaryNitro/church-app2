import App from "./App";
import AppChat from "./AppChat";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

const Diff = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chat" element={<AppChat />} />
        {/* You can define more routes here */}
      </Routes>
    </Router>
  );
};

export default Diff;
