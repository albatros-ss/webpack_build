'use strict';

import Vue from 'vue'
import App from './App.vue'
import "normalize.css";
import "../styles/main.scss";
import "../image/favicon/favicon.png";

function requireAll(r) {
  r.keys().forEach(r);
}

requireAll(require.context("../icons/", true, /\.svg$/));

new Vue({
  el: '#app',
  render: h => h(App)
});

(function () {

  let self = {};
  self.init = function () {

  };

  document.addEventListener("DOMContentLoaded", function () {
    self.init();
  });

})();
