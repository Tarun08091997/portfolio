import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-transparent text-[#1E1E1E] dark:text-[#F5F5F5] transition-colors duration-300">
          {/* Fixed Theme Toggle in Top Right Corner */}
          <div className="fixed top-20 right-4 z-[100]">
            <ThemeToggle />
          </div>
          <Navbar />
          <HomePage />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
