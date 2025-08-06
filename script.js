const apiKey ='3a37db8665f0ac987666663357a23200';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const weatherContainer = document.getElementById('weatherContainer');
const loading = document.getElementById('loading');

// Display weather data in the UI
function updateUI(data) {
  document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById('description').textContent = data.weather[0].description;
  document.getElementById('temperature').textContent = `${Math.round(data.main.temp)} °C`;
  document.getElementById('humidity').textContent = data.main.humidity;
  document.getElementById('wind').textContent = data.wind.speed;
  document.getElementById('pressure').textContent = data.main.pressure;
  document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherContainer.classList.remove('hidden');
}

// Fetch weather by city
async function getWeatherByCity(city) {
  loading.classList.remove('hidden');
  try {
    const response = await fetch(`${baseUrl}?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    if (data.cod !== 200) throw new Error(data.message);
    updateUI(data);
  } catch (err) {
    alert(`Error: ${err.message}`);
  } finally {
    loading.classList.add('hidden');
  }
}

// Fetch weather by geolocation
function getWeatherByLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported by your browser");
    return;
  }

  loading.classList.remove('hidden');
  navigator.geolocation.getCurrentPosition(async position => {
    const { latitude, longitude } = position.coords;
    try {
      const response = await fetch(`${baseUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
      const data = await response.json();
      updateUI(data);
    } catch (err) {
      alert("Failed to fetch weather data.");
    } finally {
      loading.classList.add('hidden');
    }
  }, () => {
    alert("Could not get your location.");
    loading.classList.add('hidden');
  });
}

// Event listeners
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) getWeatherByCity(city);
});

locationBtn.addEventListener('click', getWeatherByLocation);
