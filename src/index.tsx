import "./assets/css/index.css";
import React from "react";
import ReactDOM from "react-dom";
import { Home, Callback } from "./containers";
import { library } from "@fortawesome/fontawesome-svg-core";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

library.add(fab, fas, far);

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route exact path="/">
        <Home />
      </Route>

      <Route path="/callback">
        <Callback />
      </Route>
    </Router>
  </React.StrictMode>,

  document.getElementById("root")
);
