import "./assets/css/index.css";
import React from "react";
import ReactDOM from "react-dom";
import { Home, Callback } from "./containers";
import { library } from "@fortawesome/fontawesome-svg-core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { RecoilRoot } from "recoil";

library.add(fab, fas, far);

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>

        <Switch>
          <Route path="/callback" component={Callback} />
        </Switch>
      </Router>
    </RecoilRoot>
  </React.StrictMode>,

  document.getElementById("root")
);
