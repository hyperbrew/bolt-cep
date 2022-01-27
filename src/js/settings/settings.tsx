import { useEffect } from "react";
import { FaAdobe, FaBolt } from "react-icons/fa";
import { csi, evalES, evalFile } from "../lib/utils";
import logo from "../logo.svg";
import "./settings.scss";

const Settings = () => {
  const jsxTest = () => {
    console.log(evalES(`helloWorld("${csi.getApplicationID()}")`));
  };
  useEffect(() => {
    if (window.cep) {
      console.log(`${csi.getSystemPath("extension")}/jsx/index.js`);
      evalFile(`${csi.getSystemPath("extension")}/jsx/index.js`).then(() => {});
    }
  }, []);
  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} className="app-logo" alt="logo" />
        <h1>Bolt CEP - Settings</h1>
        <FaBolt />
        <p>Vite + React + TypeScript + Scss</p>
        <button onClick={jsxTest}>
          <FaAdobe />
        </button>
      </header>
    </div>
  );
};

export default Settings;
