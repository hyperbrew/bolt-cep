import { useEffect } from "react";
import { FaAdobe, FaBolt } from "react-icons/fa";
import { csi, evalES, evalFile } from "../lib/utils";
import { fs } from "../lib/node";
import logo from "../logo.svg";
import "./settings.scss";

const Settings = () => {
  const jsxTest = () => {
    console.log(evalES(`helloWorld("${csi.getApplicationID()}")`));
  };
  useEffect(() => {
    if (window.cep) {
      const extRoot = csi.getSystemPath("extension");
      const jsxSrc = `${extRoot}/jsx/index.js`;
      const jsxBinSrc = `${extRoot}/jsx/index.jsxbin`;
      if (fs.existsSync(jsxSrc)) {
        evalFile(jsxSrc);
      } else if (fs.existsSync(jsxBinSrc)) {
        evalFile(jsxBinSrc);
      }
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
