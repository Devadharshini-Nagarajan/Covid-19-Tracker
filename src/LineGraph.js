import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

function LineGraph({ casesType = "cases" }) {
  const [data, setData] = useState({});

  const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;
    for (let el in data[casesType]) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: el,
          y: data[casesType][el] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][el];
    }
    return chartData;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res) => res.json())
        .then((data) => {
          const chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };
    fetchData();
  }, [casesType]);

  return (
    <div>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                data: data,
                backgroundColor:
                  casesType === "cases"
                    ? "rgba(204,15,52,0.5)"
                    : casesType === "recovered"
                    ? "rgba(125,215,29,0.5)"
                    : "rgba(251,68,67,0.5)",
                borderColor:
                  casesType === "cases"
                    ? "rgb(204,16,52)"
                    : casesType === "recovered"
                    ? "rgb(125,215,29)"
                    : "rgb(251,68,67)",
                pointRadius: 0,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
