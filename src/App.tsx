import React from "react";
import "./App.css";
// import CandleChart from "./CandleChart";
// import LiquidityChart from "./LiquidityChart";
// import TradingViewChart from "./TradingViewChart";
import MyTradingViewChart from "./MyTradingViewChart";

function App() {
  return (
    <div className="App">
      {/* <TradingViewChart /> */}

      {/* <hr></hr> */}
      <MyTradingViewChart />

      {/* <CandleChart/> */}
      {/*  <LiquidityChart/> */}
    </div>
  );
}

export default App;
