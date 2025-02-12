import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from "~/pages/Chat.jsx";
import "~/css/globals.css";

createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/:channelName" element={<Chat />} />
    </Routes>
  </Router>
);
