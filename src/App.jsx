import { useEffect, useState } from 'react'
import './App.css'
// Images
import searchIcon from "./assets/search.png";
import clearIcon from "./assets/clear.png";
import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/rain.png";
import windIcon from "./assets/wind.png";
import snowIcon from "./assets/snow.png";
import humidityIcon from "./assets/humidty.png";

//weather Details componenet
const WeatherDetails=({icon,temp,city,country,lat,log,humidity,wind}) => {
  return(
    <>
      <div className="image" >
        <img src={icon} alt="Image" className='image'/>
      </div>
      <div className="temp">{temp}°C</div>
      <div className="city">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className='lat'>Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='log'>Longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="Humidity" className='icon'/>
          <div className="data">
            <div className="humidity-percent">
              {humidity}%
            </div>
            <div className="text">Humidty</div>
          </div>
        </div>

        <div className="element">
          <img src={windIcon} alt="Wind" className='icon'/>
          <div className="data">
            <div className="wind-percent">
              {wind} km/h
            </div>
            <div className="text">wind speed</div>
          </div>
        </div>
      </div>
    </>
  )
};
WeatherDetails.propTypes= {
   icon:PropTypes.string.isRequired,
   temp:PropTypes.number.isRequired,
   city:PropTypes.string.isRequired,
   country:PropTypes.string.isrequired,
   lat:PropTypes.number.isRequired,
   log:PropTypes.number.isRequired,
   humidity:PropTypes.number.isRequired,
   wind:PropTypes.number.isRequired,

};


function App() {
  let api_key="ce9411b9d7e3b6f758adaa9eeaa76dcc";
  const [text,setText]=useState("Chennai");

  const [icon,setIcon]=useState(snowIcon);
  const [temp,setTemp]=useState(0);
  const [city,setCity]=useState('Chennai');
  const [country,setCountry]=useState('IN');
  const [lat,setLat]=useState(0);
  const [log,setLog]=useState(0);
  const [wind,setWind]=useState(0);
  const [humidity,setHumidity]=useState(0);

  const [cityNotFound,setCityNotFound]=useState(false);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "09n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () =>{
    setLoading(true);
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;


    try{
      let res=await fetch(url);
      let data=await res.json();
      console.log(data);
      if(data.cod==="404"){
        console.error("City Not Found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);

      const WeatherDetails=data.weather[0].icon;
      setIcon(weatherIconMap[WeatherDetails] || clearIcon);
      setCityNotFound(false);
    }catch(error){
      console.error("An error occured:",error.message);
    }finally{
      setLoading(false);
    }
  };
  const handleCity=(e) => {
    setText(e.target.value);
  };
  const handleKeyDown = (e) => {
    if(e.key==='Enter'){
      search();
    }
  }

  useEffect(function () {
    search();
  },[]);
  return (
    <>
      <div>
        <div className="container">
          <div className="input-container">
            <input type="text"
             className='cityInput' 
             placeholder='Search City' 
             onChange={handleCity} 
             value={text}
             onKeyDown={handleKeyDown}/>
            <div className="search-icon" onClick={() => search()}>
              <img src={searchIcon} alt="Search"/>
            </div>
          </div>
          {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind}/>}
          

          {loading && <div className="loading-message">Loading......</div>}
          {error && <div className="error-message">{error}</div>}
          {cityNotFound && <div className="city-not-found">City Not Found</div>}
          <div className="copyright">
          <p>Designed by <span>Kalaiselvi</span></p>
        </div>
        </div>
        
      </div>
    </>
  )
}

export default App
