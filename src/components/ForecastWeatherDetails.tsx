import React from 'react'
import Container from './Container'
import WeatherIcon from './WeatherIcon'
import {WeatherDetailProps} from './WeatherDetails';
import { convertKelvinToFahrenheit } from '@/utils/convertKelvinToFahrenheit';

export interface ForecastWeatherDetailProps extends WeatherDetailProps{
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

export default function ForecastWeatherDetails(
  props: ForecastWeatherDetailProps
) {
    const {
      weatherIcon = "02d",
      date = "10.11",
      day = "Friday",
      temp,
      feels_like,
      temp_min,
      temp_max,
      description
    } = props;

  return (
    <Container className='gap-4'>
      {/* Left section */}
      <section className='flex gap-4 items-center px-4'>
        <div>
          <WeatherIcon iconName={weatherIcon}/>
          <p>{date}</p>
          <p className='text-sm'>{day}</p>
        </div>
        <div>
          <span className='text-5xl'>{convertKelvinToFahrenheit(temp ?? 0)}°</span>
          <p>
            <span>Feels Like</span>
            <span>{convertKelvinToFahrenheit(feels_like ?? 0)}</span>
          </p>
          <p className='capitalize'>{description}</p>
        </div>
      </section>
    </Container>
  )
}