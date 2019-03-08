module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../../../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime/regenerator");

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return convertImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return getCookie; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return updateCookie; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return generateUUID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return loginUser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return updateUser; });
/* unused harmony export getGames */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return createGame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return updateGame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return deleteGame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return joinGame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return submitAnswer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return connectGameboard; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return gameCategories; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return gameDifficulties; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return questionType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return gameStates; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var uuid_by_string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var uuid_by_string__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(uuid_by_string__WEBPACK_IMPORTED_MODULE_1__);


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


var convertImage = function convertImage(url, callback) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';

  img.onload = function () {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL('jpg');
    callback(dataURL);
    canvas = null;
  };

  img.src = url;
};
var getCookie = function getCookie(cookie) {
  var name = cookie + '=';
  var decodedCookie = decodeURIComponent(window.document.cookie);
  var ca = decodedCookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }

  return '';
};
var updateCookie = function updateCookie(userid) {
  document.cookie = "gs_userid=".concat(userid);
}; //Create UUID from the current time and the UserAgent details to ensure variances.

var generateUUID = function generateUUID(UA) {
  var ua = UA.replace(/\D+/g, '');
  var time = Date.now();
  return uuid_by_string__WEBPACK_IMPORTED_MODULE_1___default()("".concat(ua, " + ").concat(time));
}; //Login to the game backend.

var loginUser =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(userID) {
    var data, userDetails;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = JSON.stringify({
              userID: userID
            });
            _context.next = 3;
            return fetch("".concat("https://192.168.1.88:3000", "/api/user"), {
              method: 'POST',
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
              body: data
            }).then(function (res) {
              return res.json();
            });

          case 3:
            userDetails = _context.sent;
            return _context.abrupt("return", userDetails);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function loginUser(_x) {
    return _ref.apply(this, arguments);
  };
}();
var updateUser =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(_ref2) {
    var userID, avatar, data, user;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userID = _ref2.userID, avatar = _ref2.avatar;
            data = JSON.stringify({
              userID: userID,
              avatar: avatar
            });
            _context2.next = 4;
            return fetch("".concat("https://192.168.1.88:3000", "/api/user"), {
              method: 'PUT',
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
              body: data
            });

          case 4:
            user = _context2.sent;
            return _context2.abrupt("return", user);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function updateUser(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
var getGames =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3() {
    var games;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return fetch("".concat("https://192.168.1.88:3000", "/api/game"), {
              method: 'GET',
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              }
            }).then(function (res) {
              return res.json();
            });

          case 2:
            games = _context3.sent;
            return _context3.abrupt("return", games);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getGames() {
    return _ref4.apply(this, arguments);
  };
}(); //Request to create a new game.

var createGame =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(gameSettings) {
    var data, game;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            data = JSON.stringify({
              gameSettings: gameSettings
            });
            _context4.next = 3;
            return fetch("".concat("https://192.168.1.88:3000", "/api/game"), {
              method: 'POST',
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
              body: data
            }).then(function (res) {
              return res.json();
            });

          case 3:
            game = _context4.sent;
            return _context4.abrupt("return", game.gameid);

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function createGame(_x3) {
    return _ref5.apply(this, arguments);
  };
}(); //Update gamestate and question number to display.

var updateGame =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(_ref6) {
    var state, gameID, qNumber, data, game;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            state = _ref6.state, gameID = _ref6.gameID, qNumber = _ref6.qNumber;
            data = JSON.stringify({
              state: state,
              gameID: gameID,
              qNumber: qNumber
            });
            _context5.next = 4;
            return fetch("".concat("https://192.168.1.88:3000", "/api/game"), {
              method: 'PUT',
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
              body: data
            }).then(function (res) {
              return res.json();
            });

          case 4:
            game = _context5.sent;
            return _context5.abrupt("return", game);

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function updateGame(_x4) {
    return _ref7.apply(this, arguments);
  };
}(); //Delete a completed game.

var deleteGame =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee6(gameID) {
    var data, deleted;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            data = JSON.stringify({
              gameID: gameID
            });
            _context6.next = 3;
            return fetch("".concat("https://192.168.1.88:3000", "/api/game"), {
              method: 'DELETE',
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
              body: data
            }).then(function (res) {
              return res.json();
            });

          case 3:
            deleted = _context6.sent;
            return _context6.abrupt("return", deleted);

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function deleteGame(_x5) {
    return _ref8.apply(this, arguments);
  };
}(); //Join a game from QR code.

var joinGame =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee7(_ref9) {
    var userID, gameID, data, joined;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            userID = _ref9.userID, gameID = _ref9.gameID;
            data = JSON.stringify({
              userID: userID,
              gameID: gameID
            });
            _context7.next = 4;
            return fetch("".concat("https://192.168.1.88:3000", "/api/player"), {
              method: 'POST',
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
              body: data
            }).then(function (res) {
              return res.json();
            });

          case 4:
            joined = _context7.sent;
            return _context7.abrupt("return", joined);

          case 6:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function joinGame(_x6) {
    return _ref10.apply(this, arguments);
  };
}(); //Submit answer to the current game.

var submitAnswer =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee8(answer) {
    var data, result;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            data = JSON.stringify({
              answer: answer
            });
            _context8.next = 3;
            return fetch("".concat("https://192.168.1.88:3000", "/api/score"), {
              method: 'POST',
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
              body: data
            });

          case 3:
            result = _context8.sent;
            return _context8.abrupt("return", result);

          case 5:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function submitAnswer(_x7) {
    return _ref11.apply(this, arguments);
  };
}(); //Connect gameboard to game.

var connectGameboard =
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee9(gameboard) {
    var data, board;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            data = JSON.stringify(gameboard);
            _context9.next = 3;
            return fetch("".concat("https://192.168.1.88:3000", "/api/gameboard"), {
              method: 'POST',
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
              body: data
            });

          case 3:
            board = _context9.sent;
            return _context9.abrupt("return", board);

          case 5:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function connectGameboard(_x8) {
    return _ref12.apply(this, arguments);
  };
}(); //Possible question categories.

var gameCategories = [{
  value: 'any',
  display: 'Any Category'
}, {
  value: 9,
  display: 'General Knowledge'
}, {
  value: 16,
  display: 'Entertainment: Board Games'
}, {
  value: 10,
  display: 'Entertainment: Books'
}, {
  value: 32,
  display: 'Entertainment: Cartoon & Animations'
}, {
  value: 29,
  display: 'Entertainment: Comics'
}, {
  value: 11,
  display: 'Entertainment: Film'
}, {
  value: 31,
  display: 'Entertainment: Japanese Anime & Manga'
}, {
  value: 12,
  display: 'Entertainment: Music'
}, {
  value: 13,
  display: 'Entertainment: Musicals & Theatres'
}, {
  value: 14,
  display: 'Entertainment: Television'
}, {
  value: 15,
  display: 'Entertainment: Video Games'
}, {
  value: 17,
  display: 'Science &amp; Nature'
}, {
  value: 18,
  display: 'Science: Computers'
}, {
  value: 19,
  display: 'Science: Mathematics'
}, {
  value: 20,
  display: 'Mythology'
}, {
  value: 21,
  display: 'Sports'
}, {
  value: 22,
  display: 'Geography'
}, {
  value: 23,
  display: 'History'
}, {
  value: 24,
  display: 'Politics'
}, {
  value: 25,
  display: 'Art'
}, {
  value: 27,
  display: 'Animals'
}, {
  value: 26,
  display: 'Celebrities'
}, {
  value: 28,
  display: 'Vehicles'
}, {
  value: 30,
  display: 'Science: Gadgets'
}]; //Game difficulty levels.

var gameDifficulties = [{
  value: 'any',
  display: 'Any Difficulty'
}, {
  value: 'easy',
  display: 'Easy'
}, {
  value: 'medium',
  display: 'Medium'
}, {
  value: 'hard',
  display: 'Hard'
}]; //Possible question types.

var questionType = [{
  value: 'multiple',
  display: 'Multiple Choice'
}, {
  value: 'boolean',
  display: 'True / False'
}, {
  value: 'any',
  display: 'Mixed'
}];
var gameStates = {
  NOTSTARTED: 0,
  CREATED: 1,
  STARTED: 2,
  QUESTIONS: 3,
  ENDED: 4,
  RESET: 5
};

/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports) {

module.exports = require("styled-jsx/style");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("next/link");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("uuid-by-string");

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var bootstrap_dist_css_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(10);
/* harmony import */ var bootstrap_dist_css_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bootstrap_dist_css_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_3__);




var defaultDescription = '';
var defaultOGURL = '';
var defaultOGImage = '';

var Head = function Head(props) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(next_head__WEBPACK_IMPORTED_MODULE_1___default.a, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("meta", {
    charSet: "UTF-8"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("title", null, props.title || ''), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("meta", {
    name: "description",
    content: props.description || defaultDescription
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("meta", {
    name: "viewport",
    content: "width=device-width, initial-scale=1"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("link", {
    rel: "icon",
    sizes: "192x192",
    href: "/static/touch-icon.png"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("link", {
    rel: "apple-touch-icon",
    href: "/static/touch-icon.png"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("link", {
    rel: "mask-icon",
    href: "/static/favicon-mask.svg",
    color: "#49B882"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("link", {
    rel: "icon",
    href: "/static/favicon.ico"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("meta", {
    property: "og:url",
    content: props.url || defaultOGURL
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("meta", {
    property: "og:title",
    content: props.title || ''
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("meta", {
    property: "og:description",
    content: props.description || defaultDescription
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("meta", {
    name: "twitter:site",
    content: props.url || defaultOGURL
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("meta", {
    name: "twitter:card",
    content: "summary_large_image"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("meta", {
    name: "twitter:image",
    content: props.ogImage || defaultOGImage
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("meta", {
    property: "og:image",
    content: props.ogImage || defaultOGImage
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("meta", {
    property: "og:image:width",
    content: "1200"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("meta", {
    property: "og:image:height",
    content: "630"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("link", {
    href: "https://fonts.googleapis.com/css?family=Dosis:400,700",
    rel: "stylesheet"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("link", {
    rel: "stylesheet",
    href: "https://use.fontawesome.com/releases/v5.7.2/css/all.css",
    integrity: "sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr",
    crossOrigin: "anonymous"
  }));
};

/* harmony default export */ __webpack_exports__["a"] = (Head);

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("next/head");

/***/ }),
/* 10 */
/***/ (function(module, exports) {



/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("qrcode.react");

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var bootstrap_dist_css_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var bootstrap_dist_css_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(bootstrap_dist_css_bootstrap_min_css__WEBPACK_IMPORTED_MODULE_4__);






var Nav = function Nav(props) {
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("nav", {
    className: "jsx-4153864986" + " " + "fixed-bottom"
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("ul", {
    className: "jsx-4153864986"
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("li", {
    className: "jsx-4153864986"
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(next_link__WEBPACK_IMPORTED_MODULE_2___default.a, {
    prefetch: true,
    href: "/"
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("a", {
    className: "jsx-4153864986"
  }, "HOME"))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("ul", {
    className: "jsx-4153864986"
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("li", {
    className: "jsx-4153864986"
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(next_link__WEBPACK_IMPORTED_MODULE_2___default.a, {
    href: "https://github.com/alavas"
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("a", {
    className: "jsx-4153864986" + " " + "align-middle"
  }, "PHONETRIVIA"))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("li", {
    style: lodash__WEBPACK_IMPORTED_MODULE_3___default.a.isNull(props.avatar) ? {
      display: 'none'
    } : {
      padding: '0px',
      marginTop: '2.5px'
    },
    className: "jsx-4153864986"
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("img", {
    src: props.avatar,
    className: "jsx-4153864986" + " " + "avatar"
  })))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(styled_jsx_style__WEBPACK_IMPORTED_MODULE_0___default.a, {
    styleId: "4153864986",
    css: ["body{margin:0;font-family:-apple-system,BlinkMacSystemFont,Avenir Next, Avenir,Helvetica,sans-serif;}", "nav.jsx-4153864986{z-index:999;text-align:center;width:100%;border-style:solid;border-width:1px 0px 0px 0px;background-color:lightgrey !important;height:65px !important;}", "ul.jsx-4153864986{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;}", "nav.jsx-4153864986>ul.jsx-4153864986{position:relative;padding:4px 16px;}", "li.jsx-4153864986{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;margin-top:7.5px;padding:6px 8px;}", "a.jsx-4153864986{color:#212529;-webkit-text-decoration:none;text-decoration:none;font-size:1.5em;padding-right:15px;}", ".avatar.jsx-4153864986{vertical-align:middle;width:50px;height:50px;border-radius:50%;}"]
  }));
};

/* harmony default export */ __webpack_exports__["a"] = (Nav);

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),
/* 14 */,
/* 15 */
/***/ (function(module, exports) {

module.exports = require("react-websocket");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("react-qr-reader");

/***/ }),
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(31);


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var qrcode_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11);
/* harmony import */ var qrcode_react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(qrcode_react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_websocket__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(15);
/* harmony import */ var react_websocket__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_websocket__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2);
/* harmony import */ var _components_head__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8);
/* harmony import */ var _components_nav__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(12);



function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

if (typeof window != 'undefined') {
  var QrReader = __webpack_require__(16);
}







/*{gameID: "b467a78b-ec9d-45e7-a595-d6903c9ddc22", gamestate: 3, qNumber: 1, questionID: "f006b954-1d86-4a48-8752-05e150430418", answertype: "multiple"} */

var Player =
/*#__PURE__*/
function (_Component) {
  _inherits(Player, _Component);

  function Player() {
    var _this;

    _classCallCheck(this, Player);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Player).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleScan", function (data) {
      var regex = RegExp('(.*/player/)([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})');

      if (data) {
        //Regex to confirm that the link is valid.
        if (regex.test(data)) {
          _this.setState({
            result: data,
            validGame: true
          }); //Redirect to the game URL.


          window.location = data;
        } else {
          _this.setState({
            validGame: false
          });
        }
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleError", function (err) {
      console.error(err);
    });

    _this.state = {
      userID: '',
      avatar: null,
      result: 'No Result',
      validGame: false,
      gamestate: null,
      gameID: '',
      answer: null,
      qNumber: 0,
      qStart: 0,
      questionID: '',
      answertype: '',
      joined: false
    };
    return _this;
  }

  _createClass(Player, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handlePageOpened();
    }
  }, {
    key: "convertedImg",
    value: function () {
      var _convertedImg = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(avatar) {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return Object(_utilities__WEBPACK_IMPORTED_MODULE_5__[/* updateUser */ "p"])({
                  userID: this.state.userID,
                  avatar: avatar
                });

              case 2:
                this.setState({
                  avatar: avatar,
                  imgReady: true
                });

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function convertedImg(_x) {
        return _convertedImg.apply(this, arguments);
      }

      return convertedImg;
    }()
  }, {
    key: "handlePageOpened",
    value: function () {
      var _handlePageOpened = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {
        var userID, loggedIn, gameID, joined;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                userID = Object(_utilities__WEBPACK_IMPORTED_MODULE_5__[/* getCookie */ "i"])('gs_userid');

                if (userID === '' || userID === 'undefined') {
                  userID = Object(_utilities__WEBPACK_IMPORTED_MODULE_5__[/* generateUUID */ "h"])(window.navigator.userAgent);
                }

                _context2.next = 4;
                return this.userLogin(userID);

              case 4:
                loggedIn = _context2.sent;

                if (!(loggedIn && this.props.gameID != null)) {
                  _context2.next = 13;
                  break;
                }

                gameID = this.props.gameID;
                _context2.next = 9;
                return Object(_utilities__WEBPACK_IMPORTED_MODULE_5__[/* joinGame */ "j"])({
                  userID: userID,
                  gameID: gameID
                });

              case 9:
                joined = _context2.sent;

                if (joined) {
                  this.setState({
                    joined: true,
                    gamestate: 1
                  });
                }

                _context2.next = 14;
                break;

              case 13:
                this.setState({
                  gamestate: 0
                });

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function handlePageOpened() {
        return _handlePageOpened.apply(this, arguments);
      }

      return handlePageOpened;
    }()
  }, {
    key: "userLogin",
    value: function () {
      var _userLogin = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(userID) {
        var userDetails;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return Object(_utilities__WEBPACK_IMPORTED_MODULE_5__[/* loginUser */ "k"])(userID);

              case 2:
                userDetails = _context3.sent;
                Object(_utilities__WEBPACK_IMPORTED_MODULE_5__[/* updateCookie */ "n"])(userDetails.userid); //If the user doesn't have an avatar generate a random one.

                if (userDetails.avatar === null) {
                  Object(_utilities__WEBPACK_IMPORTED_MODULE_5__[/* convertImage */ "b"])('https://picsum.photos/250/?random', this.convertedImg.bind(this));
                }

                this.setState({
                  userID: userDetails.userid,
                  avatar: userDetails.avatar,
                  score: userDetails.score
                });
                return _context3.abrupt("return", true);

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function userLogin(_x2) {
        return _userLogin.apply(this, arguments);
      }

      return userLogin;
    }()
  }, {
    key: "sendAnswer",
    value: function () {
      var _sendAnswer = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(answer) {
        var reaction, score, submission, result;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                reaction = Date.now() - this.state.qStart;
                reaction = Math.max(reaction, 1000);
                score = Math.round(25 * (10000 / (reaction - 500)));
                score = Math.min(Math.max(score, 0), 250);
                submission = {
                  gameID: this.state.gameID,
                  questionID: this.state.questionID,
                  userID: this.state.userID,
                  answer: answer,
                  reaction: reaction,
                  score: score
                };
                result = Object(_utilities__WEBPACK_IMPORTED_MODULE_5__[/* submitAnswer */ "m"])(submission);

                if (result) {
                  this.setState({
                    answer: answer
                  });
                }

              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function sendAnswer(_x3) {
        return _sendAnswer.apply(this, arguments);
      }

      return sendAnswer;
    }()
  }, {
    key: "handleData",
    value: function handleData(data) {
      data = JSON.parse(data);
      this.setState(_objectSpread({}, data, {
        answer: null
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      if (this.state.gamestate === _utilities__WEBPACK_IMPORTED_MODULE_5__[/* gameStates */ "g"].RESET) {
        window.location = "https://192.168.1.88:3000";
      }

      return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
        className: "jsx-1523567316"
      }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_components_head__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"], {
        title: "Gameshow"
      }), this.state.gamestate !== _utilities__WEBPACK_IMPORTED_MODULE_5__[/* gameStates */ "g"].ENDED ? react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_components_nav__WEBPACK_IMPORTED_MODULE_7__[/* default */ "a"], {
        avatar: this.state.avatar
      }) : null, this.state.joined ? react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react_websocket__WEBPACK_IMPORTED_MODULE_4___default.a, {
        url: "wss:192.168.1.88:3000",
        protocol: this.props.gameID,
        onMessage: this.handleData.bind(this)
      }) : null, function () {
        switch (_this2.state.gamestate) {
          case _utilities__WEBPACK_IMPORTED_MODULE_5__[/* gameStates */ "g"].NOTSTARTED:
            return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
              className: "jsx-1523567316" + " " + "row"
            }, QrReader ? react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(QrReader, {
              delay: 300,
              onError: _this2.handleError,
              onScan: _this2.handleScan,
              style: {
                width: '100%'
              },
              className: "card"
            }) : null, _this2.state.validGame ? react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("p", {
              className: "jsx-1523567316"
            }, "JOIN") : react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("p", {
              className: "jsx-1523567316"
            }, "Scan a game QR code."));

          case _utilities__WEBPACK_IMPORTED_MODULE_5__[/* gameStates */ "g"].CREATED:
            return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
              className: "jsx-1523567316" + " " + "row"
            }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("a", {
              className: "jsx-1523567316" + " " + "card"
            }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("h3", {
              className: "jsx-1523567316"
            }, "WAITING TO BEGIN...")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
              className: "jsx-1523567316" + " " + "qr"
            }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(qrcode_react__WEBPACK_IMPORTED_MODULE_3___default.a, {
              value: "".concat("https://192.168.1.88:3000", "/player/").concat(_this2.props.gameID),
              size: 225,
              bgColor: '#ffffff',
              fgColor: '#000000',
              level: 'L',
              includeMargin: false,
              renderAs: 'svg'
            })), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("a", {
              className: "jsx-1523567316" + " " + "card"
            }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("h3", {
              className: "jsx-1523567316"
            }, "LEAVE GAME")));

          case _utilities__WEBPACK_IMPORTED_MODULE_5__[/* gameStates */ "g"].STARTED:
            return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
              className: "jsx-1523567316" + " " + "row"
            }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("a", {
              className: "jsx-1523567316" + " " + "card"
            }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("h3", {
              className: "jsx-1523567316"
            }, "Waiting for a question...")));

          case _utilities__WEBPACK_IMPORTED_MODULE_5__[/* gameStates */ "g"].QUESTIONS:
            return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
              className: "jsx-1523567316" + " " + "row"
            }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("h3", {
              className: "jsx-1523567316"
            }, "Question Number ", _this2.state.qNumber), _this2.state.answertype === 'boolean' ? react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("a", {
              style: {
                backgroundColor: '#FFF0000'
              },
              onClick: function onClick() {
                return _this2.sendAnswer('A');
              },
              className: "jsx-1523567316" + " " + ((_this2.state.answer === null ? 'card' : _this2.state.answer === 'A' ? 'card answer' : 'card disabled') || "")
            }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("h3", {
              className: "jsx-1523567316"
            }, "TRUE")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("a", {
              style: {
                backgroundColor: '#0000FF'
              },
              onClick: function onClick() {
                return _this2.sendAnswer('B');
              },
              className: "jsx-1523567316" + " " + ((_this2.state.answer === null ? 'card' : _this2.state.answer === 'B' ? 'card answer' : 'card disabled') || "")
            }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("h3", {
              className: "jsx-1523567316"
            }, "FALSE"))) : react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("a", {
              style: {
                backgroundColor: '#FF0000'
              },
              onClick: function onClick() {
                return _this2.sendAnswer('A');
              },
              className: "jsx-1523567316" + " " + ((_this2.state.answer === null ? 'card' : _this2.state.answer === 'A' ? 'card answer' : 'card disabled') || "")
            }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("h3", {
              className: "jsx-1523567316"
            }, "A")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("a", {
              style: {
                backgroundColor: '#FFFF00'
              },
              onClick: function onClick() {
                return _this2.sendAnswer('B');
              },
              className: "jsx-1523567316" + " " + ((_this2.state.answer === null ? 'card' : _this2.state.answer === 'B' ? 'card answer' : 'card disabled') || "")
            }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("h3", {
              className: "jsx-1523567316"
            }, "B")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("a", {
              style: {
                backgroundColor: '#008000'
              },
              onClick: function onClick() {
                return _this2.sendAnswer('C');
              },
              className: "jsx-1523567316" + " " + ((_this2.state.answer === null ? 'card' : _this2.state.answer === 'C' ? 'card answer' : 'card disabled') || "")
            }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("h3", {
              className: "jsx-1523567316"
            }, "C")), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("a", {
              style: {
                backgroundColor: '#0000FF'
              },
              onClick: function onClick() {
                return _this2.sendAnswer('D');
              },
              className: "jsx-1523567316" + " " + ((_this2.state.answer === null ? 'card' : _this2.state.answer === 'D' ? 'card answer' : 'card disabled') || "")
            }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("h3", {
              className: "jsx-1523567316"
            }, "D"))));

          case _utilities__WEBPACK_IMPORTED_MODULE_5__[/* gameStates */ "g"].ENDED:
            return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
              className: "jsx-1523567316" + " " + "row"
            }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("a", {
              className: "jsx-1523567316" + " " + "card"
            }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("h1", {
              className: "jsx-1523567316"
            }, "GAME OVER")));

          default:
            return null;
        }
      }(), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default.a, {
        styleId: "1523567316",
        css: ["html{width:100vw;height:100vhnav;font-size:12px !important;}", ".row.jsx-1523567316{max-width:60%;margin-left:auto;margin-right:auto;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;height:calc(100vh - 68.3px);}", ".qr.jsx-1523567316{margin-bottom:25px;text-align:center;}", ".card.jsx-1523567316{padding:18px 18px 24px;margin-bottom:25px;-webkit-text-decoration:none;text-decoration:none;text-align:center;color:#000000;border:1px solid #9b9b9b;}", ".card.jsx-1523567316:hover{border-color:#067df7;}", ".card.jsx-1523567316 p.jsx-1523567316{margin:0;padding:12px 0 0;font-size:13px;color:#000000;}", ".disabled.jsx-1523567316{pointer-events:none;cursor:not-allowed;opacity:0.25;-webkit-filter:alpha(opacity=25);filter:alpha(opacity=25);-webkit-box-shadow:none;box-shadow:none;}", ".answer.jsx-1523567316{pointer-events:none;cursor:not-allowed;box-shadow:none;border:3px solid #9b9b9b;}"]
      }));
    }
  }], [{
    key: "getInitialProps",
    value: function getInitialProps(_ref) {
      var query = _ref.query;
      return {
        gameID: query.gameKey
      };
    }
  }]);

  return Player;
}(react__WEBPACK_IMPORTED_MODULE_2__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Player);

/***/ })
/******/ ]);