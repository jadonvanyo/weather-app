'use client'

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, fromUnixTime, parse, parseISO } from "date-fns";
import Container from "@/components/Container";
import { convertKelvinToFahrenheit } from "@/utils/convertKelvinToFahrenheit";
import WeatherIcon from "@/components/WeatherIcon";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcons";
import WeatherDetails from "@/components/WeatherDetails";
import { metersToKilometers } from "@/utils/metersToKilometers";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import ForecastWeatherDetails from "@/components/ForecastWeatherDetails";

type WeatherData = {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      '3h': number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
};

export default function Home() {
  const { isLoading, error, data } = useQuery<WeatherData>({
    queryKey: ['repoData'],
    queryFn: async () =>
    {
      const {data} = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=cleveland&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`);
      return data;
    }
  })

  const firstData = data?.list[0];

  console.log("data", firstData)

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  // Filtering data to get the first entry after 6 AM for eac unique date
  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    })
  })

  if (isLoading) 
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      {/* today data */}
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4 text-black">
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
              <p className="text-lg">({format(parseISO(firstData?.dt_txt ?? ""), "MM.dd.yyyy")})</p>
            </h2>
            <Container className="gap- 10 px-6 items-center">
              {/* temperature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinToFahrenheit(firstData?.main.temp ?? 297)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels like</span>
                  <span>
                    {convertKelvinToFahrenheit(firstData?.main.feels_like ?? 297)}°
                  </span>
                </p>
                <p className="text-xs space-x-2 whitespace-nowrap">
                  <span>
                    H: {convertKelvinToFahrenheit(firstData?.main.temp_max ?? 0)}°
                  </span>
                  <span>
                    L: {convertKelvinToFahrenheit(firstData?.main.temp_min ?? 0)}°
                  </span>
                </p>
              </div>
              {/* time and weather icon */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    {/* TODO: Limit this to just next 24 hours */}
                    <p className="whitespace-nowrap">{format(parseISO(d.dt_txt), "h:mm a")}</p>
                    {/* <WeatherIcon iconName={d.weather[0].icon}/> */}
                    <WeatherIcon 
                      iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)}
                    /> 
                    <p>{convertKelvinToFahrenheit(d?.main.temp ?? 0)}°</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
            {/* left */}
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">{firstData?.weather[0].description}</p>
              <WeatherIcon
                iconName={getDayOrNightIcon(
                  firstData?.weather[0].icon ?? "", 
                  firstData?.dt_txt ?? ""
                )}
              />
            </Container>
            <Container className="bg-blue-200 px-6 gap-4 justify-between overflow-x-auto">
              <WeatherDetails 
                visibility={metersToKilometers(firstData?.visibility ?? 10000)}
                airPressure={`${firstData?.main.pressure} hPa`}
                humidity={`${firstData?.main.humidity}%`}
                windSpeed={convertWindSpeed(firstData?.wind.speed ?? 0)}
                sunrise={format(fromUnixTime(data?.city.sunrise ?? 1702949452), 'H:mm')}
                sunset={format(fromUnixTime(data?.city.sunset ?? 1702517657), 'H:mm')}
              />
            </Container>
            {/* right */}
          </div>
        </section>

        {/* 7 day forecast */}
        <section className="flex w-full flex-col gap-4">
            <p className="text-2xl"> Forecast (7 days)</p>
            {firstDataForEachDate.map((d,i) => (
              <ForecastWeatherDetails
                key={i}
                description={d?.weather[0].description ?? ""}
                weatherIcon={d?.weather[0].icon ?? "01d"}
                date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
                day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
                feels_like={d?.main.temp ?? 0}
                temp={d?.main.temp ?? 0}
                temp_max={d?.main.temp_max ?? 0}
                temp_min={d?.main.temp_min ?? 0}
                airPressure={`${d?.main.humidity}%`}
                humidity={`${d?.main.humidity}%`}
                sunrise={format(
                  fromUnixTime(data?.city.sunrise ?? 1702517657),
                  "H:mm"
                )}
                sunset={format(
                  fromUnixTime(data?.city.sunset ?? 1702517657),
                  "H:mm"
                )}
                visibility={`${metersToKilometers(d?.visibility ?? 10000)}`}
                windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)}`}
              />
            ))}
            
        </section>
      </main>
    </div>
  );
}
