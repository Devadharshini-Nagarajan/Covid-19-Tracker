import React from "react";
import numeral from "numeral";
import "./Table.css";

function Table({ countries }) {
  return (
    <div className="table">
      {countries.map((el) => (
        <tr>
          <td>{el.country}</td>
          <td>
            <strong>{numeral(el.cases).format('0,0')}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
