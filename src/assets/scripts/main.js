"use strict";

import "normalize.css";
import "../styles/main.scss";

function requireAll(r) {
  r.keys().forEach(r);
}

requireAll(require.context("../icons/", true, /\.svg$/));

(function () {

  let self = {};
  self.init = function () {

  };

  document.addEventListener("DOMContentLoaded", function () {
    self.init();
  });

})();
