const searchForm = document.querySelector('#searchForm')
const cityInput = document.querySelector('#cityInput')
const currentWeatherContainer = document.querySelector('#currentWeather')
const forecastContainer = document.querySelector('#forecast')
const popularCitiesContainer = document.querySelector('#popularCities')

const API_KEY = '1a2af42186818b885fc9324c8ccf333f' // 0_o
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

async function fetchCurrentWeather(city) {
	const url = `${BASE_URL}/weather?q=${encodeURIComponent(
		city
	)}&appid=${API_KEY}&units=metric`
	const response = await fetch(url)

	if (!response.ok) {
		throw new Error('City not found')
	}

	const data = await response.json()
	return data
}

async function fetchForecast(city) {
	const url = `${BASE_URL}/forecast?q=${encodeURIComponent(
		city
	)}&appid=${API_KEY}&units=metric`
	const response = await fetch(url)

	if (!response.ok) {
		throw new Error('Failed to fetch forecast')
	}

	const data = await response.json()
	return data
}

function renderCurrentWeather(data) {
	return `
    <div class="weather-card">
      <h2>Current Weather in ${data.name}</h2>
      <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
      <p><strong>Weather:</strong> ${data.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Wind:</strong> ${data.wind.speed} m/s</p>
    </div>
  `
}

function renderForecast(data) {
	const forecastItems = data.list.slice(0, 5).map(item => {
		const date = new Date(item.dt * 1000)
		return `
      <div class="forecast-card">
        <h3>${date.toLocaleString()}</h3>
        <p><strong>Temp:</strong> ${item.main.temp} °C</p>
        <p><strong>Weather:</strong> ${item.weather[0].description}</p>
      </div>
    `
	})

	return `
    <h2>Forecast</h2>
    <div class="forecast-container">
      ${forecastItems.join('')}
    </div>
  `
}

searchForm.addEventListener('submit', async e => {
	e.preventDefault()
	const city = cityInput.value.trim()

	if (!city) return

	try {
		const current = await fetchCurrentWeather(city)
		const forecast = await fetchForecast(city)

		currentWeatherContainer.innerHTML = renderCurrentWeather(current)
		forecastContainer.innerHTML = renderForecast(forecast)
	} catch (error) {
		currentWeatherContainer.innerHTML = `<p style="color: red">${error.message}</p>`
		forecastContainer.innerHTML = ''
	}
})

window.goBack = function () {
	window.location.reload()
}

async function loadWeather(city) {
	try {
		const current = await fetchCurrentWeather(city)
		const forecast = await fetchForecast(city)

		currentWeatherContainer.innerHTML = renderCurrentWeather(current)
		forecastContainer.innerHTML = renderForecast(forecast)
	} catch (error) {
		currentWeatherContainer.innerHTML = `<p style="color: red">${error.message}</p>`
		forecastContainer.innerHTML = ''
	}
}

searchForm.addEventListener('submit', e => {
	e.preventDefault()
	const city = cityInput.value.trim()
	if (city) {
		loadWeather(city)
	}
})

popularCitiesContainer.addEventListener('click', e => {
	if (e.target.tagName === 'BUTTON') {
		const city = e.target.dataset.city
		if (city) {
			cityInput.value = city
			loadWeather(city)
		}
	}
})
