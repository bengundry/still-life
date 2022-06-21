import React from "react"
import "./App.css"

import Header from "./features/header/Header"
import Grid from "./features/grid/Grid"

export default function App() {
  return (
      <>
        <Header />
        <main className="app-main">
            <Grid />
            <div />
        </main>
      </>
  )
}