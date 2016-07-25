var Instrument = ({instrument, handleClick}) => (
  <div className="" onClick={() => handleClick(instrument)}>
    {instrument}
  </div>
);

window.Instrument = Instrument;
