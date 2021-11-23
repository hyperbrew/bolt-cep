import { FaBolt, FaSync } from "react-icons/fa";
import logo from "../logo.svg";
import "./settings.scss";

const Settings = () => {
  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} className="app-logo" alt="logo" />
        <h1>Bolt CEP -- Settings</h1>
        <FaBolt />
        <p>Vite + React + TypeScript + Scss</p>
      </header>
    </div>
  );
};

export default Settings;
