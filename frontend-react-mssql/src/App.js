import React from "react";
import "./App.css";
import { Shellbar } from "fundamental-react/Shellbar";
import { BrowserRouter as Router, Route } from "react-router-dom";
import OrderTable from "./components/orderTable";

function App() {
  return (
    <div className="App fd-shell fd-shell--fundamentals">
      <Shellbar
        logo={<img alt="SAP" src="//unpkg.com/fundamental-styles/dist/images/sap-logo.png" />}
        productTitle="Kyma Sample App"
      />

      <div className="fd-shell__app">
        <div className="fd-app">
          <main className="fd-app__main main">
            <Router>
              <Route exact path="/" render={(props) => <OrderTable {...props} />} />
            </Router>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
