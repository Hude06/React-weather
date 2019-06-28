import React from 'react';
import './App.css';
import { API_KEY } from "./config";
import { Card, getEmoji } from "./Components/Card";
import ProgressBar from "./Components/ProgressBar";
import TodaysCard from "./Components/TodaysCard";
import City from "./Components/City";
import { getDate, getTime, hasGeolocationSupport } from "./Helpers";
import Emoji from "./Components/Emoji";
import Anchor from "./Components/Anchor";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { btnDisabled: false, darkMode: false, fixCity: false, geoAccess: null };
    this.coords = null;
    this.onScroll = this.onScroll.bind(this);
    this.PERMISSION_DENIED = "Permission denied. Can't show weather information.";
  }
  componentDidMount() {
    if (hasGeolocationSupport()) {
      this.fetchTodaysWeather();
      this.onScroll();
    }
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.fixCityBar.bind(this));
  }
  fetchTodaysWeather() {
    navigator.geolocation.getCurrentPosition(async (c) => {
      this.coords = { longitude: c.coords.longitude, latitude: c.coords.latitude };
      fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${this.coords.latitude}&lon=${this.coords.longitude}&units=metric&APPID=${API_KEY}`)
        .then(weather => weather.json())
        .then(data => this.setState({ current: data, geoAccess: true }, () => console.log(this.state)));
    }, () => alert(this.PERMISSION_DENIED));
  }
  fetchForecastWeather() {
    navigator.geolocation.getCurrentPosition(async (c) => {
      this.coords = { longitude: c.coords.longitude, latitude: c.coords.latitude };
      fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${this.coords.latitude}&lon=${this.coords.longitude}&units=metric&APPID=${API_KEY}`)
        .then(weather => weather.json())
        .then(data => this.setState({ ...data, btnDisabled: true, geoAccess: true }, () => console.log(this.state)));
    }, () => alert(this.PERMISSION_DENIED));
  }
  fixCityBar() {
    if (window.scrollY > 70 && !this.state.fixCity) {
      this.setState({ fixCity: true });
    } else if (window.scrollY <= 70 && this.state.fixCity) {
      this.setState({ fixCity: false })
    }
  }
  onScroll() {
    window.addEventListener("scroll", this.fixCityBar.bind(this));
  }
  render() {
    if (this.state.geoAccess && this.state.current) {
      return (
        <>
          <ProgressBar />
          <City current={this.state.current} fix={this.state.fixCity} />
          <TodaysCard emoji={this.state.current.weather[0]} main={this.state.current.main} sys={this.state.current.sys} />
          <button disabled={this.state.btnDisabled} style={{ opacity: this.state.btnDisabled ? "0" : "1" }} onClick={this.fetchForecastWeather.bind(this)} className="btn-fetch">Load 5 day weather forecast</button>
          {this.state.list && < div className="container">
            {this.state.list.map((w, index) =>
              <Card key={index} date={getDate(w.dt)} emoji={getEmoji(w.weather[0].main, getTime(w.dt))} mainWeather={w.weather[0].main} maxTemp={w.main.temp_max} minTemp={w.main.temp_min} temp={w.main.temp} time={getTime(w.dt)} weather={w.weather[0].description} />)}
          </div>}
        </>
      );
    } else {
      return (
        <>
          <h3 className="text-center heading-location-access">Allow location access.</h3>
          <div className="container center-item">
            <h2><Emoji name="Earth Globe" emoji="🌎" /> Weather App build with... <Emoji name="Earth Globe" emoji="🌎" /></h2>
            <ul className="no-margin">
              <li>
                <Anchor href="https://reactjs.org" text="React" />
              </li>
              <li>
                <Anchor href="https://developer.mozilla.org/en-US/docs/Web/API/Geolocation" text="Geolocation" />
              </li>
              <li>
                <Anchor href="https://openweathermap.org" text="openweathermap.org-API" />
              </li>
            </ul>
          </div>
        </>
      );
    }
  }
}

export default App;
