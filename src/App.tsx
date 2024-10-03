import React from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import "./App.css";
import { MainSidebar, BaseMap, Landing } from "./components";

function App() {
    const project = window.location.pathname.split("/")[1];

    // if project is undefined, redirect to /primavera
    if (project === "") {
        window.location.href = "/primavera";
    }

    return (
        <div style={{ width: "100dvw", height: "100dvh" }}>
            <Landing />
        </div>
    );
}

export default App;
