import React, { StrictMode } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import "./App.css";
import { Landing } from "./components";

function App() {
    return (
        <StrictMode>
            <div style={{ width: "100dvw", height: "100dvh" }}>
                <Landing />
            </div>
        </StrictMode>
    );
}

export default App;
