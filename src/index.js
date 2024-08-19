const weatherApp = (function () {
  const getCountry = () => {
    const form = document.querySelector(".cont_nav_search");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const country = document.getElementById("searchCountry").value;
      const formatedCountry =
        country.charAt(0).toUpperCase() + country.slice(1).toLowerCase();

      const dataWeather = await getDataWeather(formatedCountry);
      const currentCondiction = await dataWeather.currentConditions;
      const dataWeatherDays = await dataWeather.days;

      console.log(dataWeather);

      APPDOM.updateDivGeneral(dataWeather, currentCondiction);
      APPDOM.updateListDays(dataWeatherDays);
      if(dataWeather.alerts.length !== 0){
        APPDOM.updateAlertsMeteorologic(dataWeather);
      }
      form.reset();
    });
  };

  const getDataWeather = async (country) => {
    const urlWeather = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${country}?key=YK8GZG3GQYALXFWKYRKLMH56P`;
    const response = await fetch(urlWeather);
    try {
      if (!response.ok) {
        console.log("error en la respuesta de la API");
      }
      const data = response.json();
      return data;
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  const fahrenheitToCelsius = (fahrenheit) => {
    const result = ((fahrenheit - 32) * 5) / 9;
    return result.toFixed(2);
  };

  return { getCountry, fahrenheitToCelsius };
})();

const APPDOM = (function () {
  const main = document.getElementById("main_content");

  const updateDivGeneral = (dataWeather, currentCondiction) => {
    main.innerHTML = "";
    const div_general = document.createElement("div");
    div_general.classList.add("card_general");

    div_general.innerHTML = `
      <h2 class="description_weather">${dataWeather.description}</h2>
            <div class="cont_icon_weather">
                ${selectIcon(currentCondiction.icon)}
                <b class="hour">${currentCondiction.datetime}</b>
            </div>
            <div class="info_day">
                <div class="info">
                    <b>Temp:</b>
                    <b>${weatherApp.fahrenheitToCelsius(
                      currentCondiction.temp
                    )} °C</b>
                </div>
                <div class="info">
                    <b>Humidity:</b>
                    <b>${currentCondiction.humidity} %</b>
                </div>
                <div class="info">
                    <b>Precip. Prob:</b>
                    <b>${currentCondiction.precipprob} %</b>
                </div>
                <div class="info">
                    <b>Wind Spd:</b>
                    <b>${currentCondiction.windspeed} km/h</b>
                </div>
                <div class="info">
                    <b>Condition:</b>
                    <b>${currentCondiction.conditions}</b>
                </div>        
            </div>`;
    main.append(div_general);
    const location = document.getElementById("location");
    location.innerText = dataWeather.resolvedAddress;
  };

  const selectIcon = (icon) => {
    switch (icon) {
      case "snow":
        return `<i class="fa-regular fa-snowflake"></i>`;
      case "rain":
        return `<i class="fa-solid fa-cloud-showers-heavy"></i>`;
      case "fog":
        return `<i class="fa-solid fa-smog"></i>`;
      case "wind":
        return `<i class="fa-solid fa-wind"></i>`;
      case "cloudy":
        return `<i class="fa-solid fa-cloud"></i>`;
      case "partly-cloudy-day":
        return `<i class="fa-solid fa-cloud-sun"></i>`;
      case "partly-cloudy-night":
        return `<i class="fa-solid fa-cloud-moon"></i>`;
      case "clear-day":
        return `<i class="fa-solid fa-sun"></i>`;
      case "clear-night":
        return `<i class="fa-solid fa-moon"></i>`;
      default:
        return `<i class="fa-solid fa-sun"></i>`;
    }
  };

  const updateListDays = (dataWeatherDays) => {
    const div_days = document.createElement("div");
    div_days.classList.add("card_days");

    dataWeatherDays.forEach((item) => {
      let div_days_info = document.createElement("div");
      div_days_info.classList.add("days");

      // Convertir la fecha en un objeto Date
      const date = new Date(item.datetime);
      const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const dayOfWeek = daysOfWeek[date.getDay()];

      div_days_info.innerHTML = `
                <div class="date">
                  <h2>${dayOfWeek}</h2>
                  <span>${item.datetime}</span>
                </div>
                <span class="icon_days">${selectIcon(item.icon)}</span>
                <div class="con_temp">
                  <span>Max: ${weatherApp.fahrenheitToCelsius(
                    item.tempmax
                  )}</span>
                  <span>Min: ${weatherApp.fahrenheitToCelsius(
                    item.tempmin
                  )}</span>
                  <span>RainProb: ${weatherApp.fahrenheitToCelsius(
                    item.precipprob
                  )} %</span>
                </div>
        `;
      div_days.append(div_days_info);
    });

    main.append(div_days);
  };

  const updateAlertsMeteorologic = (dataWeather) => {
    const div_alert = document.createElement("div");
    const h2 = document.createElement("h2");
    h2.innerText ="Meteorologic Alerts";
    div_alert.append(h2);
    div_alert.classList.add("div_alert");


    let alerts = dataWeather.alerts;

    alerts.forEach((item)=>{
      console.log(item)
      div_alert.innerHTML += `<p>${item}</p>
    `
    })

    
    main.append(div_alert);
  };
  return { updateDivGeneral, selectIcon, updateListDays, updateAlertsMeteorologic };
})();

weatherApp.getCountry();
