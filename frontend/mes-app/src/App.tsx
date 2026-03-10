import React from "react";
import { ComponentToEdit } from "./ComponentToEdit";
import "./App.css";

function App() {
    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    return (
        <div className="App">
            <header className="app-header">
                <h1 className="app-title">Products</h1>
                <img
                    className="app-logo"
                    src={`${process.env.PUBLIC_URL}/logo192.png`}
                    alt="Application logo"
                />
            </header>

            <main className="app-main">
                <ComponentToEdit />
            </main>

            <footer className="app-footer">
                <span>{currentDate}</span>
            </footer>
        </div>
    );
}

export default App;
