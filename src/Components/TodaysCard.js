import React from "react";
import { getEmoji } from "./Card";
import Emoji from "./Emoji";
export default (props) => {
  console.log(props);
  const { emoji, main, sys, city } = props;
  const getTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    return `${hour}:${minutes}`;
  };
  const weatherEmoji = getEmoji(emoji.main);
  const mainTemp = Math.round(main.temp);
  const mainTempMin = Math.round(main.temp_min);
  const mainTempMax = Math.round(main.temp_max);
  return (
    <>
      <div className="weather-wrapper">
        <div className="weather-card">
          <div className="weather-icon sun"></div>
          <h1>{mainTemp}°C</h1>
          <p>{city}</p>
        </div>
      </div>
      <section className="today-weather">
        <Emoji
          className="today-as-emoji"
          name={emoji.description}
          emoji={weatherEmoji}
        />
        <span className="today-degree" title={`Temperature: ${mainTemp}°`}>
          {mainTemp}°C
        </span>
        <span
          className="today-min-max-degree"
          title={`Min: ${mainTempMin} / Max: ${mainTempMax} - Humidity: ${main.humidity}%`}
        >
          {mainTempMin}°C/ {mainTempMax}°C - {main.humidity}%
        </span>
        <Emoji
          className="today-sunrise"
          name={`Sunrise - ${getTime(sys.sunrise)}`}
          emoji={`🌘 ${getTime(sys.sunrise)}`}
        />
        <Emoji
          className="today-sunset"
          name={`Sunset - ${getTime(sys.sunset)}`}
          emoji={`🌘 ${getTime(sys.sunset)}`}
        />
      </section>
    </>
  );
};
