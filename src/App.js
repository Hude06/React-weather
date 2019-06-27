import React from 'react';
import './App.css';
import { API_KEY } from "./config";
import { Card, getEmoji } from "./Components/Card";
import ProgressBar from "./Components/ProgressBar";
import TodaysCard from "./Components/TodaysCard";

const City = (props) => <h1 className="text-center"><span role="img" title={props.city} aria-label="Round Pushpin">📍</span> {props.city}</h1>;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { btnDisabled: false };
    this.coords = null;
  }
  componentDidMount() {
    this.fetchTodaysWeather();
  }
  fetchTodaysWeather() {
    if (this.hasGeolocation) {
      navigator.geolocation.getCurrentPosition(async (c) => {
        this.coords = { longitude: c.coords.longitude, latitude: c.coords.latitude };
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${this.coords.latitude}&lon=${this.coords.longitude}&units=metric&APPID=${API_KEY}`)
          .then(weather => weather.json())
          .then(data => this.setState({ current: data }, () => console.log(this.state)));
      }, () => alert("Permission denied. Can't show weather information."));
    }
  }
  hasGeolocation() {
    return !!navigator.geolocation;
  }
  fetchForecastWeather() {
    this.setState({ btnDisabled: true });
    if (this.hasGeolocation()) {
      navigator.geolocation.getCurrentPosition(async (c) => {
        //console.log(`http://api.openweathermap.org/data/2.5/forecast?lat=${c.coords.latitude}&lon=${c.coords.longitude}&units=metric&APPID=${API_KEY}`);
        this.coords = { longitude: c.coords.longitude, latitude: c.coords.latitude };
        fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${this.coords.latitude}&lon=${this.coords.longitude}&units=metric&APPID=${API_KEY}`)
          .then(weather => weather.json())
          .then(data => this.setState({ ...data }, () => console.log(this.state)));
      }, () => alert("Permission denied. Can't show weather information."));
    } else {
      alert("No Geolocation Support!")
    }

  }
  getDate(date) {
    return new Date(date * 1000).toLocaleDateString();
  }
  getTime(time) {
    return `${new Date(time * 1000).getHours()}:00`;
  }
  getBackgroundColor(time) {
    const t = parseInt(time);
    if (t > 0 && t < 6) {
      return "linear-gradient(117deg, rgb(185, 185, 185), rgba(23, 23, 23, 0.82))";
    } else if (t >= 6 && t <= 11) {
      return "linear-gradient(145deg, #ffffff, #fff4a9)";
    } else if (t >= 11 && t <= 18) {
      return "linear-gradient(328deg, #fde051, rgb(255, 244, 169))";
    } else if (t >= 18 && t <= 23) {
      return "linear-gradient(100deg, rgb(253, 224, 81), rgba(140, 140, 140, 0.02))";
    } else {
      return "linear-gradient(117deg, rgb(185, 185, 185), rgba(23, 23, 23, 0.82))";
    }
  }
  render() {
    return (
      <>
        <ProgressBar />
        {this.state.current && this.state.current.name && <City city={this.state.current.name} />}
        {this.state.current && this.state.current.weather && <TodaysCard emoji={this.state.current.weather[0]} main={this.state.current.main} sys={this.state.current.sys} />}
        <button disabled={this.state.btnDisabled} onClick={this.fetchForecastWeather.bind(this)} className="btn-fetch">Load 5 day weather forecast</button>
        <div className="container">
          {this.state.list && this.state.list.map((w, index) =>
            <Card key={index} backgroundColor={this.getBackgroundColor(this.getTime(w.dt))} date={this.getDate(w.dt)} emoji={getEmoji(w.weather[0].main, this.getTime(w.dt))} mainWeather={w.weather[0].main} maxTemp={w.main.temp_max} minTemp={w.main.temp_min} temp={w.main.temp} time={this.getTime(w.dt)} weather={w.weather[0].description} />)}
        </div>
      </>
    );
  }
}

export default App;
