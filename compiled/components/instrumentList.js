"use strict";

var InstrumentList = function InstrumentList(_ref) {
  var handleClick = _ref.handleClick;
  return React.createElement(
    "div",
    { className: "" },
    instruments.map(function (instrument, index) {
      return React.createElement(Instrument, { instrument: instrument, key: index, handleClick: handleClick });
    })
  );
};

window.InstrumentList = InstrumentList;