import React from 'react';

export default function WastedTime(props) {
  let wastedSec = Math.floor((props.wastedTime / 1000) % 60),
    wastedMin = Math.floor((props.wastedTime / (1000 * 60)) % 60),
    wastedHr = Math.floor((props.wastedTime / (1000 * 60 * 60)) % 24);

  wastedHr = wastedHr < 10 ? '0' + wastedHr : wastedHr;
  wastedMin = wastedMin < 10 ? '0' + wastedMin : wastedMin;
  wastedSec = wastedSec < 10 ? '0' + wastedSec : wastedSec;
  return (
    <div className="bg-danger text-white rounded shadow-sm p-3">
      <div className="text-center my-4">
        <h3>Wasted Time</h3>
        <span className="h1">{wastedHr + ' : ' + wastedMin + ' : ' + wastedSec}</span>
        {/* <button className="btn btn-block btn-outline-warning mt-4" onClick={props.handlePauseWastedTime}>
          {props.isWastedTimePaused ? 'PAUSED ▶️' : 'PAUSE ⏸️'}
        </button> */}
      </div>
    </div>
  );
}
