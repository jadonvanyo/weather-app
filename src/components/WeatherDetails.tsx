import React from 'react'
import { FiDroplet } from 'react-icons/fi';
import { ImMeter } from 'react-icons/im';
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu"
import { MdAir } from 'react-icons/md';

export interface WeatherDetailProps {
    visibility: string;
    humidity: string;
    windSpeed: string;
    airPressure: string;
    sunrise: string;
    sunset: string;
}

export default function WeatherDetails(props: WeatherDetailProps) {
  const {
    visibility = "25km",
    humidity = "61%",
    windSpeed = "string",
    airPressure = "string",
    sunrise = "string",
    sunset = "string"
  } = props;
  
  return (
    <>
        <SingleWeatherDetailProps
            icon={<LuEye/>}
            information='Visibility'
            value={props.visibility}
        />
        <SingleWeatherDetailProps
            icon={<FiDroplet/>}
            information='Humidity'
            value={props.humidity}
        />
        <SingleWeatherDetailProps
            icon={<MdAir/>}
            information='Wind Speed'
            value={props.windSpeed}
        />
        <SingleWeatherDetailProps
            icon={<ImMeter/>}
            information='Air Pressure'
            value={props.airPressure}
        />
        <SingleWeatherDetailProps
            icon={<LuSunrise/>}
            information='Sunrise'
            value={props.sunrise}
        />
        <SingleWeatherDetailProps
            icon={<LuSunset/>}
            information='Sunset'
            value={props.sunset}
        />
    </>
  )
}

export interface SingleWeatherDetailProps {
    information: string;
    icon: React.ReactNode;
    value: string;
}

function SingleWeatherDetailProps(props: SingleWeatherDetailProps) {
    return (
        <div className='flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80'>
            <p className='whitespace-nowrap'>{props.information}</p>
            <div className='text-3xl'>{props.icon}</div>
            <p>{props.value}</p>
        </div>
    )
}