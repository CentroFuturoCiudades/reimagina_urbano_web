import React from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import "./App.css";
import { Landing } from "./components";

function App() {
    return (
        <div style={{ width: "100dvw", height: "100dvh" }}>
            <Landing />
        </div>
    );
}

export default App;
