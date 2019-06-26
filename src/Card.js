import React from 'react';
const TimeHeader = (props) => <h2 className="card-time">{props.time}</h2>;

const EmojiWeather = (props) => {
    const getEmoji = () => {
        const w = props.mainWeather;
        const t = parseInt(props.time);
        if (w === "Clouds") {
            return "☁️";
        } else if (w === "Rain") {
            return "🌧️";
        } else if (w === "Sun") {
            return (t > 0 && t < 6) ? "🌙" : "☀️";
        } else if (w === "Clear") {
            return (t > 0 && t < 6) ? "🌙" : "☀️"; // "🌈" "🌌";
        } else if (w === "Snow") {
            return "❄️";
        } else if (w === "Extreme") {
            return "🌩️";
        }
    };
    return (
        <span className="card-weather-emoji" role="img" title={props.weather} aria-label={props.weather}>{getEmoji()}</span>
    );
};

const Degree = (props) => {
    return (
        <div className="card-degree">
            <span className="card-degree">{props.temp}°</span> <span className="card-separator">|</span> <span className="card-min-degree">{props.minTemp}°</span>
        </div>
    );
};

export const Card = (props) => {
    return (
        <div className="card-body" style={{ background: props.backgroundColor }}>
            <TimeHeader time={props.time} />
            <span className="card-date">{props.date}</span>
            <EmojiWeather weather={props.weather} time={props.time} mainWeather={props.mainWeather} />
            <Degree temp={props.temp} minTemp={props.minTemp} />
        </div>
    );
};