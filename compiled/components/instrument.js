"use strict";

var Instrument = function Instrument(_ref) {
  var instrument = _ref.instrument;
  var handleClick = _ref.handleClick;
  return React.createElement(
    "div",
    { className: "", onClick: function onClick() {
        return handleClick(instrument);
      } },
    instrument
  );
};

window.Instrument = Instrument;