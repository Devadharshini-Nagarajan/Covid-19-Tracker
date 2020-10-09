import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import "./Infobox.css";

function Infobox({ title, isRed, casesType, cases, active, total, ...props }) {
  return (
    <Card
      className={`infobox ${active && "infobox--selected"}`}
      style={{
        borderColor:
          casesType === "cases"
            ? "rgba(204,15,52)"
            : casesType === "recovered"
            ? "rgba(125,215,29)"
            : "rgba(251,68,67)",
      }}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography className="infobox__title" color="textSecondary">
          {title}
        </Typography>
        <h2 className="infobox__cases">{cases}</h2>
        <Typography className="infobox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Infobox;
