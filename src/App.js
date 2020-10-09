import React, { useState, useEffect } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { sortData, prettyPrintStat } from "./utils";
import Infobox from "./Infobox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";

import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 14.80746,
    lng: 40.4796,
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    const fetchCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((el) => ({
            name: el.country,
            value: el.countryInfo.iso2,
          }));
          setCountries(countries);
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          onCountryChange("worldwide");
        });
    };
    fetchCountries();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
        setCountry(countryCode);
        if (data.countryInfo) {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        }

        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={(e) => onCountryChange(e.target.value)}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((el) => (
                <MenuItem value={el.value}>{el.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <Infobox
            isRed
            active={casesType === "cases"}
            casesType={casesType}
            onClick={(e) => setCasesType("cases")}
            title="CoronaVirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <Infobox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            casesType={casesType}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <Infobox
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            casesType={casesType}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 style={{ marginTop: "20px" }}>Worldwide new {casesType} </h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
