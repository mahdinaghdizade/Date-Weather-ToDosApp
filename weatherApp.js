'use strict';

/* -------------------------Setup global Variables--------------------------- */
import {
    MainNav as mainNav
} from "./components/main-navigation/main-navigation.js";
window.customElements.define("main-nav-comp", mainNav);

const $ = document;
const weatherMapApiKey = '65957d87f0fe89fac9499ef24c164757';
let userLat, userLon;

/*let btnToggle = false;
const menuBtns = $.querySelectorAll('.header svg');
const navBar = $.querySelector('.navBar');*/

const currentDayContainer = $.querySelector('#layerTop div:first-child span:first-child');
const currentDayNumContainer = $.querySelector('#layerTop div:first-child span:last-child')
const timeContainer = $.getElementById('digitalClock');
const weatherIcon = $.querySelector('#weatherIcon img');
let currentWeatherStatus, sunsetTime, sunriseTime;

const sideRotators = $.querySelectorAll('circle, #layer1>div:last-child>div svg, #downSvg2+div svg');
const sideToday = $.querySelector('#sideContainer>div:first-child');
const sideForecast = $.getElementById('forecast');
let sideToggle = false;

const hourWeathers = $.querySelectorAll('.hourWeather');
let observerHour;
const dayWeathers = $.querySelectorAll('.dayWeather');
let observerDay;
let interval;

let weather;
let AQI;
/* -------------------------------------------------------------------------- */
/*-------------------------User Interface stuff-------------------------------*/
/*menuBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!btnToggle) {
            btn.classList.add('svgBarAnimate');
            setTimeout(() => {
                navBar.style.top = '40px';
                btnToggle = true;
            }, 10);
            setTimeout(() => {
                menuBtns[1].style.display = 'block';
                btn.classList.remove('svgBarAnimate');
                btn.style.display = 'none';
            }, 370);
        } else {
            btn.classList.add('svgXAnimate');
            navBar.style.top = '-450px';
            btnToggle = false;
            setTimeout(() => {
                menuBtns[0].style.display = 'block';
                btn.classList.remove('svgXAnimate');
                btn.style.display = 'none';
            }, 350);
        }
    });
});*/
/*window.addEventListener('resize', () => {
    if (window.matchMedia("(min-width: 951px)").matches) {
        navBar.style.top = '40px';
    } else {
        navBar.style.top = '-450px';
        btnToggle = false;
        menuBtns[0].style.display = 'block';
        menuBtns[1].classList.remove('svgXAnimate');
        menuBtns[1].style.display = 'none';
    }
});*/
/*$.body.addEventListener('click', (e) => {
    if (window.matchMedia('(max-width: 1100px)').matches) {
        if (e.pageY > 600) {
            menuBtns[1].classList.add('svgXAnimate');
            navBar.style.top = '-450px';
            btnToggle = false;
            setTimeout(() => {
                menuBtns[0].style.display = 'block';
                menuBtns[1].classList.remove('svgXAnimate');
                menuBtns[1].style.display = 'none';
            }, 350);
        }
    }
});*/
sideRotators.forEach(btn => {
    btn.addEventListener('click', (e) => {
        sideToday.style.animation = 'none';  // Reset animation
        sideForecast.style.animation = 'none';
        void sideToday.offsetWidth;
        void sideForecast.offsetWidth;
        if (!sideToggle) {
            sideToday.style.animation = '0.6s cubic-bezier(.46,.03,.52,.96) forwards rotateSideCon normal';
            sideForecast.style.animation = '0.6s cubic-bezier(.46,.03,.52,.96) forwards rotateSideCon reverse';
            sideToggle = true;
            return;
        } else {
            sideToday.style.animation = '0.6s cubic-bezier(.46,.03,.52,.96) forwards rotateSideCon reverse';
            sideForecast.style.animation = '0.6s cubic-bezier(.46,.03,.52,.96) forwards rotateSideCon normal';
            sideToggle = false;
            return;
        }
    });
});
if (window.matchMedia("(min-width: 951px)").matches) {
    setupLargeScreen();
}

setInterval(() => {
    const currentTime = new Date();
    let currentDayName = currentTime.getDay();
    let currentDayNum = currentTime.getDate();
    let currentHour = currentTime.getHours();
    let currentMinute = currentTime.getMinutes();
    let currentSeconds = Math.floor(currentTime.getTime() / 1000);
    /*let isNight;
    if (sunsetTime && sunriseTime) {
        if (currentSeconds >= sunsetTime || currentSeconds < sunriseTime) {
            isNight = true;
        }
    } else {
        if (currentHour > 17 || currentHour < 6) isNight = true;
    }*/
    if (currentDayNum === 1 || currentDayNum === 11 || currentDayNum === 21 || currentDayNum === 31) {
        currentDayNum += 'st';
    } else if (currentDayNum === 2 || currentDayNum === 12 || currentDayNum === 22) {
        currentDayNum += 'nd';
    } else if (currentDayNum === 3 || currentDayNum === 13 || currentDayNum === 23) {
        currentDayNum += 'rd';
    } else currentDayNum += 'th';
    currentDayName = whichDayIsIt(currentDayName);
    currentDayContainer.innerText = currentDayName;
    currentDayNumContainer.innerText = currentDayNum;
    if (currentHour < 12) {
        if (currentHour < 10) currentHour = String('0' + currentHour);
        if (currentMinute < 10) currentMinute = String('0' + currentMinute);
        timeContainer.children[1].innerHTML = 'AM';
    } else if (currentHour > 12) {
        currentHour -= 12;
        if (currentHour < 10) currentHour = String('0' + currentHour);
        if (currentMinute < 10) currentMinute = String('0' + currentMinute);
    }
    timeContainer.children[0].innerHTML = `${currentHour}<span>:</span>${currentMinute}`;
    // The weather icon is first determined here with basic rules before being
    // updated accurately when weather data is available:
    if (currentWeatherStatus) {
        if (isNight()) {
            weatherIcon.setAttribute('src', `./files/weather_icons/${currentWeatherStatus}_night.png`);
            $.documentElement.style.setProperty('--primaryColor', '#4e4fcc');
            $.documentElement.style.setProperty('--secondaryColor', '#d6ab1c');
        } else {
            weatherIcon.setAttribute('src', `./files/weather_icons/${currentWeatherStatus}_day.png`);
            $.documentElement.style.setProperty('--primaryColor', '#d6ab1c');
            $.documentElement.style.setProperty('--secondaryColor', '#4e4fcc');
        }
    } else {
        if (isNight()) {
            weatherIcon.setAttribute('src', './files/weather_icons/clear_night.png');
            $.documentElement.style.setProperty('--primaryColor', '#4e4fcc');
            $.documentElement.style.setProperty('--secondaryColor', '#d6ab1c');
        } else {
            weatherIcon.setAttribute('src', './files/weather_icons/clear_day.png');
            $.documentElement.style.setProperty('--primaryColor', '#d6ab1c');
            $.documentElement.style.setProperty('--secondaryColor', '#4e4fcc');
        }
    }
}, 1000);

// Intersection Observer for Hourly and Daily forecasts:
let thresholds = [];
for (let i = 0; i <= 1; i += 0.01) {
    thresholds.push(i);
}
const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio < 1) {
            let scale = 0.7 + (entry.intersectionRatio * 0.3);
            entry.target.style.transform = `scale(${scale})`;
            entry.target.style.opacity = `${entry.intersectionRatio}`;
        }
        if (entry.intersectionRatio === 1) {
            entry.target.style.transform = 'scale(1, 1)';
            entry.target.style.opacity = `1`;
        }
    });
}
const optionsHour = {
    root: $.getElementById('hourlyForecast'),
    rootMargin: '0px 10px 0px 5px',
    threshold: thresholds,
}
function createHoursObserver() {
    observerHour = new IntersectionObserver(observerCallback, optionsHour);
    hourWeathers.forEach(target => {
        observerHour.observe(target);
    });
}
const optionsDay = {
    root: $.querySelector('#dailyForecast > div:nth-child(3)'),
    rootMargin: '10px 0px 5px 0px',
    threshold: thresholds,
}
function createDaysObserver() {
    observerDay = new IntersectionObserver(observerCallback, optionsDay);
    dayWeathers.forEach(target => {
        observerDay.observe(target);
    });
}
// -----------------------------------------------------

function setupLargeScreen() {
    // I've set the observer only for large screens to prevent performance and/or
    // battery issues on mobile phones.
    const scrollerL = $.querySelector('#hourlyForecast > .caret:last-child');
    const scrollerR = $.querySelector('#hourlyForecast > .caret:nth-last-child(2)');
    const hourlyForecastCont = $.querySelector('#hourlyForecast>div:nth-child(3)');
    const scrollerT = $.querySelector('#dailyForecast > .caret:nth-child(4)');
    const scrollerB = $.querySelector('#dailyForecast > .caret:last-child');
    const dailyForecastCont = $.querySelector('#dailyForecast > div:nth-child(3) > div:first-child');
    scrollerL.addEventListener('mousedown', () => {
        createHoursObserver();
        scrollerL.style.borderColor = 'white';
        let elemLeft = getComputedStyle(hourlyForecastCont).left;
        elemLeft = Number(elemLeft.slice(0, -2));
        interval = setInterval(() => {
            elemLeft -= 5;
            if (elemLeft <= -1575 + ($.getElementById('hourlyForecast')).offsetWidth - 365) {
                scrollerL.style.borderColor = 'transparent';
                scrollerL.style.display = 'none';
                clearInterval(interval);
                return;
            }
            scrollerR.style.display = 'block';
            hourlyForecastCont.style.left = `${elemLeft}px`;
        }, 1);
    });
    scrollerL.addEventListener('mouseup', () => {
        clearInterval(interval);
        scrollerL.style.borderColor = 'transparent';
        if (observerHour) {
            hourWeathers.forEach(target => {
                observerHour.unobserve(target);
            });
            observerHour = undefined;
        }
    });
    scrollerR.addEventListener('mousedown', () => {
        createHoursObserver();
        scrollerR.style.borderColor = 'white';
        let elemLeft = getComputedStyle(hourlyForecastCont).left;
        elemLeft = Number(elemLeft.slice(0, -2));
        interval = setInterval(() => {
            elemLeft += 5;
            if (elemLeft >= 10) {
                scrollerR.style.borderColor = 'transparent';
                scrollerR.style.display = 'none';
                clearInterval(interval);
                return;
            }
            scrollerL.style.display = 'block';
            hourlyForecastCont.style.left = `${elemLeft}px`;
        }, 1);
    });
    scrollerR.addEventListener('mouseup', () => {
        clearInterval(interval);
        scrollerR.style.borderColor = 'transparent';
        if (observerHour) {
            hourWeathers.forEach(target => {
                observerHour.unobserve(target);
            });
            observerHour = undefined;
        }
    });
    scrollerT.addEventListener('mousedown', () => {
        createDaysObserver();
        scrollerT.style.borderColor = 'white';
        let elemBottom = getComputedStyle(dailyForecastCont).bottom;
        elemBottom = Number(elemBottom.slice(0, -2));
        interval = setInterval(() => {
            elemBottom -= 5;
            if (elemBottom <= -5) {
                scrollerT.style.borderColor = 'transparent';
                scrollerT.style.display = 'none';
                clearInterval(interval);
                return;
            }
            scrollerB.style.display = 'block';
            dailyForecastCont.style.bottom = `${elemBottom}px`;
        }, 1);
    });
    scrollerT.addEventListener('mouseup', () => {
        clearInterval(interval);
        scrollerT.style.borderColor = 'transparent';
        if (observerDay) {
            dayWeathers.forEach(target => {
                observerDay.unobserve(target);
            });
            observerDay = undefined;
        }
    });
    scrollerB.addEventListener('mousedown', () => {
        createDaysObserver();
        scrollerB.style.borderColor = 'white';
        let elemBottom = getComputedStyle(dailyForecastCont).bottom;
        elemBottom = Number(elemBottom.slice(0, -2));
        interval = setInterval(() => {
            elemBottom += 5;
            if (elemBottom >= 180 + (440 - $.getElementById('dailyForecast').offsetHeight)) {
                scrollerB.style.borderColor = 'transparent';
                scrollerB.style.display = 'none';
                clearInterval(interval);
                return;
            }
            scrollerT.style.display = 'block';
            dailyForecastCont.style.bottom = `${elemBottom}px`;
        }, 1);
    });
    scrollerB.addEventListener('mouseup', () => {
        scrollerB.style.borderColor = 'transparent';
        clearInterval(interval);
        if (observerDay) {
            dayWeathers.forEach(target => {
                observerDay.unobserve(target);
            });
            observerDay = undefined;
        }
    });
}

/* ------------------------Get and Update Weather---------------------------- */
getWeatherInfo().then(weather => {
    updateWeatherSection(weather);
}).then(() => {
    getForecastData().then(forecastData => {
        updateForecastSection(forecastData);
    }).catch(err => {
        console.log('Error getting forecast data: ', err);
    })
}).catch(err => {
    console.log('Error getting weather info: ', err);
});

// Main:
async function getWeatherInfo() {
    let userPosition;
    try {
        userPosition = await new Promise((resolve, reject) => {
            window.navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve(position);
                }, (err) => {
                    reject(err);
                },{
                    maximumAge: 86_400_000, // a day
                    timeout: 120_000, // 2 mins
                }
            );
        });
        console.log('User Position: ', userPosition);
    } catch(err) {
        console.log('Error getting location: ', err);
        return null;
    }
    if (userPosition) {
        userLat = userPosition.coords.latitude;
        userLon = userPosition.coords.longitude;
        console.log('User location available. Fetching weather now . . .');
        try {
            let weatherMapRes = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLon}&appid=${weatherMapApiKey}&units=metric`,
                {
                    method: 'GET', // No need of course :)
                }
            );
            weather = await weatherMapRes.json();
        } catch(err) {
            console.log('Error getting weather info: ', err);
            return null;
        }
        try {
            let AQIRes = await fetch(
                `https://api.openweathermap.org/data/2.5/air_pollution?lat=${userLat}&lon=${userLon}&appid=${weatherMapApiKey}`,
            );
            AQI = await AQIRes.json();
        } catch (err) {
            console.log('Error getting Air Quality Index data: ', err);
        }
        return weather;
    }
}
async function getForecastData() {
    let hourlyForecastRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${userLat}&longitude=${userLon}&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
    let forecastData = await hourlyForecastRes.json();
    return forecastData;
}

function updateWeatherSection(weather) {
    console.log(weather);
    console.log(AQI);
    const airQuality = AQI.list[0].main.aqi;
    const airQualityHolder = $.querySelector('#layerTop div:last-child span:last-child');
    const bgVideo = $.querySelector('#bgVid video');
    currentWeatherStatus = weather.weather[0].main;
    $.getElementById('currentTemp').innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;
    $.getElementById('currentCity').innerHTML = weather.name;
    $.querySelector('#currentDetails span:first-child').innerHTML = `${currentWeatherStatus}&nbsp`;
    switch (airQuality) {
        case 1:
            airQualityHolder.innerHTML = 'Good';
            airQualityHolder.style.color = '#33b733';
            break;
        case 2:
            airQualityHolder.innerHTML = 'Fair';
            airQualityHolder.style.color = '#92d792';
            break;
        case 3:
            airQualityHolder.innerHTML = 'Moderate';
            airQualityHolder.style.color = '#b5c076';
            break;
        case 4:
            airQualityHolder.innerHTML = 'Poor';
            airQualityHolder.style.color = '#b2885f';
            break;
        case 5:
            airQualityHolder.innerHTML = 'Very Poor';
            airQualityHolder.style.color = '#af5050';
            break;
        default:
            airQualityHolder.innerHTML = 'Not Available';
    }
    switch (currentWeatherStatus) {
        case 'Thunderstorm':
            currentWeatherStatus = 'thunder';
            break;
        case 'Drizzle':
            currentWeatherStatus = 'rainy';
            break;
        case 'Rain':
            currentWeatherStatus = 'rainy';
            break;
        case 'Snow':
            currentWeatherStatus = 'snowy';
            break;
        case 'Clear':
            currentWeatherStatus = 'clear';
            break;
        case 'Clouds':
            currentWeatherStatus = 'cloudy';
            break;
        default: // for all Atmosphere stats
            currentWeatherStatus = 'windy';
            bgVideo.setAttribute('src', './files/weather_videos/clear.mp4');
            break;
    }
    if (currentWeatherStatus === 'rainy' || currentWeatherStatus === 'thunder') {
        bgVideo.setAttribute('src', './files/weather_videos/rainy.mp4');
    } else if (currentWeatherStatus !== 'windy') {
        bgVideo.setAttribute('src', `./files/weather_videos/${currentWeatherStatus}.mp4`);
    }
    let currentTimeTempo = new Date();
    let now = currentTimeTempo.getTime()
    now = Math.floor(now / 1000);
    sunriseTime = weather.sys.sunrise;
    sunsetTime = weather.sys.sunset;
    if (now >= sunsetTime || now < sunriseTime) {
        // It's Night:
        weatherIcon.setAttribute('src', `./files/weather_icons/${currentWeatherStatus}_night.png`);
        $.documentElement.style.setProperty('--primaryColor', '#4e4fcc');
        $.documentElement.style.setProperty('--secondaryColor', '#d6ab1c');
    } else {
        // It's Day:
        weatherIcon.setAttribute('src', `./files/weather_icons/${currentWeatherStatus}_day.png`);
        $.documentElement.style.setProperty('--primaryColor', '#d6ab1c');
        $.documentElement.style.setProperty('--secondaryColor', '#4e4fcc');
    }
    return 1;
}
function updateForecastSection(forecastData) {
    let hourlyData = [];
    let dailyData = [];
    let nowTempo = new Date();
    let dayTempo = nowTempo.getDay();
    nowTempo = nowTempo.getHours();
    console.log(forecastData);
    for (let i = nowTempo; i < nowTempo + 24; i++) {
        let objHour = {};
        if (i === nowTempo) {
            objHour.time = 'Now';
        } else if (i >= 24) {
            objHour.time = String(i - 24);
        } else {
            objHour.time = String(i);
        }
        objHour.status = interpretStatus(forecastData.hourly.weather_code[i]);
        switch (objHour.status) {
            case 'clear':
                if (objHour.time === 'Now') {
                    objHour.icon = isNight() ?
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 64L304 16 288 64 240 80l48 16 16 48 16-48 48-16L320 64zM440 200l-24-72-24 72-72 24 72 24 24 72 24-72 72-24-72-24zM128 288c0-72.5 48.2-133.7 114.2-153.4c-16-4.3-32.9-6.6-50.2-6.6C86 128 0 214 0 320S86 512 192 512c61.5 0 116.2-28.9 151.3-73.8c-17.2 6.4-35.9 9.8-55.3 9.8c-88.4 0-160-71.6-160-160z"/></svg>'
                        : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/></svg>';
                } else {
                    objHour.icon = isNight(objHour.time) ?
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 64L304 16 288 64 240 80l48 16 16 48 16-48 48-16L320 64zM440 200l-24-72-24 72-72 24 72 24 24 72 24-72 72-24-72-24zM128 288c0-72.5 48.2-133.7 114.2-153.4c-16-4.3-32.9-6.6-50.2-6.6C86 128 0 214 0 320S86 512 192 512c61.5 0 116.2-28.9 151.3-73.8c-17.2 6.4-35.9 9.8-55.3 9.8c-88.4 0-160-71.6-160-160z"/></svg>'
                        : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/></svg>';
                }
                break;
            case 'partly_cloudy':
                if (objHour.time === 'Now') {
                    objHour.icon = isNight() ?
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M479.5 32c-118.2 0-214.9 92-223 208.3C310 244.7 352 289.4 352 344c0 27.9-11 53.3-29 72c40.3 39.6 95.5 64 156.4 64c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.2-.5-12.6-.8-19-.8zM64 416l184 0c39.8 0 72-32.2 72-72s-32.2-72-72-72c-10.1 0-19.7 2.1-28.4 5.8C208.8 246.5 179 224 144 224c-38.7 0-71 27.5-78.4 64c-.5 0-1.1 0-1.6 0c-35.3 0-64 28.7-64 64s28.7 64 64 64z"/></svg>'
                        : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M294.2 1.2c5.1 2.1 8.7 6.7 9.6 12.1l14.1 84.7 84.7 14.1c5.4 .9 10 4.5 12.1 9.6s1.5 10.9-1.6 15.4l-38.5 55c-2.2-.1-4.4-.2-6.7-.2c-23.3 0-45.1 6.2-64 17.1l0-1.1c0-53-43-96-96-96s-96 43-96 96s43 96 96 96c8.1 0 15.9-1 23.4-2.9c-36.6 18.1-63.3 53.1-69.8 94.9l-24.4 17c-4.5 3.2-10.3 3.8-15.4 1.6s-8.7-6.7-9.6-12.1L98.1 317.9 13.4 303.8c-5.4-.9-10-4.5-12.1-9.6s-1.5-10.9 1.6-15.4L52.5 208 2.9 137.2c-3.2-4.5-3.8-10.3-1.6-15.4s6.7-8.7 12.1-9.6L98.1 98.1l14.1-84.7c.9-5.4 4.5-10 9.6-12.1s10.9-1.5 15.4 1.6L208 52.5 278.8 2.9c4.5-3.2 10.3-3.8 15.4-1.6zM144 208a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM639.9 431.9c0 44.2-35.8 80-80 80l-271.9 0c-53 0-96-43-96-96c0-47.6 34.6-87 80-94.6l0-1.3c0-53 43-96 96-96c34.9 0 65.4 18.6 82.2 46.4c13-9.1 28.8-14.4 45.8-14.4c44.2 0 80 35.8 80 80c0 5.9-.6 11.7-1.9 17.2c37.4 6.7 65.8 39.4 65.8 78.7z"/></svg>';
                } else {
                    objHour.icon = isNight(objHour.time) ?
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M479.5 32c-118.2 0-214.9 92-223 208.3C310 244.7 352 289.4 352 344c0 27.9-11 53.3-29 72c40.3 39.6 95.5 64 156.4 64c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.2-.5-12.6-.8-19-.8zM64 416l184 0c39.8 0 72-32.2 72-72s-32.2-72-72-72c-10.1 0-19.7 2.1-28.4 5.8C208.8 246.5 179 224 144 224c-38.7 0-71 27.5-78.4 64c-.5 0-1.1 0-1.6 0c-35.3 0-64 28.7-64 64s28.7 64 64 64z"/></svg>'
                        : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M294.2 1.2c5.1 2.1 8.7 6.7 9.6 12.1l14.1 84.7 84.7 14.1c5.4 .9 10 4.5 12.1 9.6s1.5 10.9-1.6 15.4l-38.5 55c-2.2-.1-4.4-.2-6.7-.2c-23.3 0-45.1 6.2-64 17.1l0-1.1c0-53-43-96-96-96s-96 43-96 96s43 96 96 96c8.1 0 15.9-1 23.4-2.9c-36.6 18.1-63.3 53.1-69.8 94.9l-24.4 17c-4.5 3.2-10.3 3.8-15.4 1.6s-8.7-6.7-9.6-12.1L98.1 317.9 13.4 303.8c-5.4-.9-10-4.5-12.1-9.6s-1.5-10.9 1.6-15.4L52.5 208 2.9 137.2c-3.2-4.5-3.8-10.3-1.6-15.4s6.7-8.7 12.1-9.6L98.1 98.1l14.1-84.7c.9-5.4 4.5-10 9.6-12.1s10.9-1.5 15.4 1.6L208 52.5 278.8 2.9c4.5-3.2 10.3-3.8 15.4-1.6zM144 208a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM639.9 431.9c0 44.2-35.8 80-80 80l-271.9 0c-53 0-96-43-96-96c0-47.6 34.6-87 80-94.6l0-1.3c0-53 43-96 96-96c34.9 0 65.4 18.6 82.2 46.4c13-9.1 28.8-14.4 45.8-14.4c44.2 0 80 35.8 80 80c0 5.9-.6 11.7-1.9 17.2c37.4 6.7 65.8 39.4 65.8 78.7z"/></svg>';
                }
                break;
            case 'cloudy':
                objHour.icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M304 160c-74.1 0-135.2 56-143.1 128L96 288c-53 0-96-43-96-96s43-96 96-96l1.1 0C104.9 41.7 151.6 0 208 0c47.9 0 88.8 30.1 104.8 72.4C324.8 67 338 64 352 64c53 0 96 43 96 96c0 12.1-2.2 23.6-6.3 34.2c-11.4 2.3-22.2 6.4-32.1 11.9C383.3 177.7 345.7 160 304 160zM224 512c-53 0-96-43-96-96c0-42.5 27.6-78.6 65.9-91.2c-1.3-6.7-1.9-13.7-1.9-20.8c0-61.9 50.1-112 112-112c43.1 0 80.5 24.3 99.2 60c14.7-17.1 36.5-28 60.8-28c44.2 0 80 35.8 80 80c0 5.5-.6 10.8-1.6 16c.5 0 1.1 0 1.6 0c53 0 96 43 96 96s-43 96-96 96l-320 0z"/></svg>';
                break;
            case 'rainy':
                objHour.icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M96 320c-53 0-96-43-96-96c0-42.5 27.6-78.6 65.9-91.2C64.7 126.1 64 119.1 64 112C64 50.1 114.1 0 176 0c43.1 0 80.5 24.3 99.2 60c14.7-17.1 36.5-28 60.8-28c44.2 0 80 35.8 80 80c0 5.5-.6 10.8-1.6 16c.5 0 1.1 0 1.6 0c53 0 96 43 96 96s-43 96-96 96L96 320zM81.5 353.9c12.2 5.2 17.8 19.3 12.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6S-3.3 490.7 1.9 478.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6zm120 0c12.2 5.2 17.8 19.3 12.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6zm244.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6s17.8 19.3 12.6 31.5zM313.5 353.9c12.2 5.2 17.8 19.3 12.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6z"/></svg>';
                break;
            case 'snowy':
                objHour.icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M224 0c13.3 0 24 10.7 24 24l0 46.1 23-23c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-57 57 0 76.5 66.2-38.2 20.9-77.8c3.4-12.8 16.6-20.4 29.4-17s20.4 16.6 17 29.4L373 142.2l37.1-21.4c11.5-6.6 26.2-2.7 32.8 8.8s2.7 26.2-8.8 32.8L397 183.8l31.5 8.4c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17l-77.8-20.9L272 256l66.2 38.2 77.8-20.9c12.8-3.4 26 4.2 29.4 17s-4.2 26-17 29.4L397 328.2l37.1 21.4c11.5 6.6 15.4 21.3 8.8 32.8s-21.3 15.4-32.8 8.8L373 369.8l8.4 31.5c3.4 12.8-4.2 26-17 29.4s-26-4.2-29.4-17l-20.9-77.8L248 297.6l0 76.5 57 57c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-23-23 0 46.1c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-46.1-23 23c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l57-57 0-76.5-66.2 38.2-20.9 77.8c-3.4 12.8-16.6 20.4-29.4 17s-20.4-16.6-17-29.4L75 369.8 37.9 391.2c-11.5 6.6-26.2 2.7-32.8-8.8s-2.7-26.2 8.8-32.8L51 328.2l-31.5-8.4c-12.8-3.4-20.4-16.6-17-29.4s16.6-20.4 29.4-17l77.8 20.9L176 256l-66.2-38.2L31.9 238.6c-12.8 3.4-26-4.2-29.4-17s4.2-26 17-29.4L51 183.8 13.9 162.4c-11.5-6.6-15.4-21.3-8.8-32.8s21.3-15.4 32.8-8.8L75 142.2l-8.4-31.5c-3.4-12.8 4.2-26 17-29.4s26 4.2 29.4 17l20.9 77.8L200 214.4l0-76.5L143 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l23 23L200 24c0-13.3 10.7-24 24-24zM487 7c9.4-9.4 24.6-9.4 33.9 0l23 23L567 7c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-23 23 23 23c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-23-23-23 23c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l23-23L487 41c-9.4-9.4-9.4-24.6 0-33.9zm32 192c9.4-9.4 24.6-9.4 33.9 0l23 23 23-23c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-23 23 23 23c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-23-23-23 23c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l23-23-23-23c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>';
                break;
            case 'thunderstorm':
                objHour.icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M16 288L320 0 260.7 197.6 432 224 128 512l59.3-197.6L16 288z"/></svg>';
                break;
            default:
                objHour.icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 24c0 13.3 10.7 24 24 24l44 0c24.3 0 44 19.7 44 44s-19.7 44-44 44L24 136c-13.3 0-24 10.7-24 24s10.7 24 24 24l332 0c50.8 0 92-41.2 92-92s-41.2-92-92-92L312 0c-13.3 0-24 10.7-24 24zm64 368c0 13.3 10.7 24 24 24l44 0c50.8 0 92-41.2 92-92s-41.2-92-92-92L24 232c-13.3 0-24 10.7-24 24s10.7 24 24 24l396 0c24.3 0 44 19.7 44 44s-19.7 44-44 44l-44 0c-13.3 0-24 10.7-24 24zM120 512l44 0c50.8 0 92-41.2 92-92s-41.2-92-92-92L24 328c-13.3 0-24 10.7-24 24s10.7 24 24 24l140 0c24.3 0 44 19.7 44 44s-19.7 44-44 44l-44 0c-13.3 0-24 10.7-24 24s10.7 24 24 24z"/></svg>';
                break;
        }
        objHour.temp = Math.round(forecastData.hourly.temperature_2m[i]);
        objHour.precip = forecastData.hourly.precipitation_probability[i];
        hourlyData.push(objHour);
    }
    console.log(hourlyData);
    hourWeathers.forEach((hour_div, index) => {
        hour_div.innerHTML = `
        <span>${hourlyData[index].time}</span>
        ${hourlyData[index].icon}
        <span>${hourlyData[index].temp}°<sup>C</sup></span>
        <span>${hourlyData[index].precip}%</span>
        `;
    });
    for (let i = 0; i < 7; i++) {
        let objDay = {};
        if (!i) {
            objDay.dayName = 'Today';
        } else {
            objDay.dayName = whichDayIsIt(dayTempo + i);
        }
        objDay.status = interpretStatus(forecastData.daily.weather_code[i]);
        switch (objDay.status) {
            case 'clear':
                objDay.icon = isNight() ?
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 64L304 16 288 64 240 80l48 16 16 48 16-48 48-16L320 64zM440 200l-24-72-24 72-72 24 72 24 24 72 24-72 72-24-72-24zM128 288c0-72.5 48.2-133.7 114.2-153.4c-16-4.3-32.9-6.6-50.2-6.6C86 128 0 214 0 320S86 512 192 512c61.5 0 116.2-28.9 151.3-73.8c-17.2 6.4-35.9 9.8-55.3 9.8c-88.4 0-160-71.6-160-160z"/></svg>'
                    : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/></svg>';
                break;
            case 'partly_cloudy':
                objDay.icon = isNight() ?
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M479.5 32c-118.2 0-214.9 92-223 208.3C310 244.7 352 289.4 352 344c0 27.9-11 53.3-29 72c40.3 39.6 95.5 64 156.4 64c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.2-.5-12.6-.8-19-.8zM64 416l184 0c39.8 0 72-32.2 72-72s-32.2-72-72-72c-10.1 0-19.7 2.1-28.4 5.8C208.8 246.5 179 224 144 224c-38.7 0-71 27.5-78.4 64c-.5 0-1.1 0-1.6 0c-35.3 0-64 28.7-64 64s28.7 64 64 64z"/></svg>'
                    : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M294.2 1.2c5.1 2.1 8.7 6.7 9.6 12.1l14.1 84.7 84.7 14.1c5.4 .9 10 4.5 12.1 9.6s1.5 10.9-1.6 15.4l-38.5 55c-2.2-.1-4.4-.2-6.7-.2c-23.3 0-45.1 6.2-64 17.1l0-1.1c0-53-43-96-96-96s-96 43-96 96s43 96 96 96c8.1 0 15.9-1 23.4-2.9c-36.6 18.1-63.3 53.1-69.8 94.9l-24.4 17c-4.5 3.2-10.3 3.8-15.4 1.6s-8.7-6.7-9.6-12.1L98.1 317.9 13.4 303.8c-5.4-.9-10-4.5-12.1-9.6s-1.5-10.9 1.6-15.4L52.5 208 2.9 137.2c-3.2-4.5-3.8-10.3-1.6-15.4s6.7-8.7 12.1-9.6L98.1 98.1l14.1-84.7c.9-5.4 4.5-10 9.6-12.1s10.9-1.5 15.4 1.6L208 52.5 278.8 2.9c4.5-3.2 10.3-3.8 15.4-1.6zM144 208a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM639.9 431.9c0 44.2-35.8 80-80 80l-271.9 0c-53 0-96-43-96-96c0-47.6 34.6-87 80-94.6l0-1.3c0-53 43-96 96-96c34.9 0 65.4 18.6 82.2 46.4c13-9.1 28.8-14.4 45.8-14.4c44.2 0 80 35.8 80 80c0 5.9-.6 11.7-1.9 17.2c37.4 6.7 65.8 39.4 65.8 78.7z"/></svg>';
                break;
            case 'cloudy':
                objDay.icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M304 160c-74.1 0-135.2 56-143.1 128L96 288c-53 0-96-43-96-96s43-96 96-96l1.1 0C104.9 41.7 151.6 0 208 0c47.9 0 88.8 30.1 104.8 72.4C324.8 67 338 64 352 64c53 0 96 43 96 96c0 12.1-2.2 23.6-6.3 34.2c-11.4 2.3-22.2 6.4-32.1 11.9C383.3 177.7 345.7 160 304 160zM224 512c-53 0-96-43-96-96c0-42.5 27.6-78.6 65.9-91.2c-1.3-6.7-1.9-13.7-1.9-20.8c0-61.9 50.1-112 112-112c43.1 0 80.5 24.3 99.2 60c14.7-17.1 36.5-28 60.8-28c44.2 0 80 35.8 80 80c0 5.5-.6 10.8-1.6 16c.5 0 1.1 0 1.6 0c53 0 96 43 96 96s-43 96-96 96l-320 0z"/></svg>';
                break;
            case 'rainy':
                objDay.icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M96 320c-53 0-96-43-96-96c0-42.5 27.6-78.6 65.9-91.2C64.7 126.1 64 119.1 64 112C64 50.1 114.1 0 176 0c43.1 0 80.5 24.3 99.2 60c14.7-17.1 36.5-28 60.8-28c44.2 0 80 35.8 80 80c0 5.5-.6 10.8-1.6 16c.5 0 1.1 0 1.6 0c53 0 96 43 96 96s-43 96-96 96L96 320zM81.5 353.9c12.2 5.2 17.8 19.3 12.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6S-3.3 490.7 1.9 478.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6zm120 0c12.2 5.2 17.8 19.3 12.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6zm244.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6s17.8 19.3 12.6 31.5zM313.5 353.9c12.2 5.2 17.8 19.3 12.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6z"/></svg>';
                break;
            case 'snowy':
                objDay.icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M224 0c13.3 0 24 10.7 24 24l0 46.1 23-23c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-57 57 0 76.5 66.2-38.2 20.9-77.8c3.4-12.8 16.6-20.4 29.4-17s20.4 16.6 17 29.4L373 142.2l37.1-21.4c11.5-6.6 26.2-2.7 32.8 8.8s2.7 26.2-8.8 32.8L397 183.8l31.5 8.4c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17l-77.8-20.9L272 256l66.2 38.2 77.8-20.9c12.8-3.4 26 4.2 29.4 17s-4.2 26-17 29.4L397 328.2l37.1 21.4c11.5 6.6 15.4 21.3 8.8 32.8s-21.3 15.4-32.8 8.8L373 369.8l8.4 31.5c3.4 12.8-4.2 26-17 29.4s-26-4.2-29.4-17l-20.9-77.8L248 297.6l0 76.5 57 57c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-23-23 0 46.1c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-46.1-23 23c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l57-57 0-76.5-66.2 38.2-20.9 77.8c-3.4 12.8-16.6 20.4-29.4 17s-20.4-16.6-17-29.4L75 369.8 37.9 391.2c-11.5 6.6-26.2 2.7-32.8-8.8s-2.7-26.2 8.8-32.8L51 328.2l-31.5-8.4c-12.8-3.4-20.4-16.6-17-29.4s16.6-20.4 29.4-17l77.8 20.9L176 256l-66.2-38.2L31.9 238.6c-12.8 3.4-26-4.2-29.4-17s4.2-26 17-29.4L51 183.8 13.9 162.4c-11.5-6.6-15.4-21.3-8.8-32.8s21.3-15.4 32.8-8.8L75 142.2l-8.4-31.5c-3.4-12.8 4.2-26 17-29.4s26 4.2 29.4 17l20.9 77.8L200 214.4l0-76.5L143 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l23 23L200 24c0-13.3 10.7-24 24-24zM487 7c9.4-9.4 24.6-9.4 33.9 0l23 23L567 7c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-23 23 23 23c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-23-23-23 23c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l23-23L487 41c-9.4-9.4-9.4-24.6 0-33.9zm32 192c9.4-9.4 24.6-9.4 33.9 0l23 23 23-23c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-23 23 23 23c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-23-23-23 23c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l23-23-23-23c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>';
                break;
            case 'thunderstorm':
                objDay.icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M16 288L320 0 260.7 197.6 432 224 128 512l59.3-197.6L16 288z"/></svg>';
                break;
            default:
                objDay.icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 24c0 13.3 10.7 24 24 24l44 0c24.3 0 44 19.7 44 44s-19.7 44-44 44L24 136c-13.3 0-24 10.7-24 24s10.7 24 24 24l332 0c50.8 0 92-41.2 92-92s-41.2-92-92-92L312 0c-13.3 0-24 10.7-24 24zm64 368c0 13.3 10.7 24 24 24l44 0c50.8 0 92-41.2 92-92s-41.2-92-92-92L24 232c-13.3 0-24 10.7-24 24s10.7 24 24 24l396 0c24.3 0 44 19.7 44 44s-19.7 44-44 44l-44 0c-13.3 0-24 10.7-24 24zM120 512l44 0c50.8 0 92-41.2 92-92s-41.2-92-92-92L24 328c-13.3 0-24 10.7-24 24s10.7 24 24 24l140 0c24.3 0 44 19.7 44 44s-19.7 44-44 44l-44 0c-13.3 0-24 10.7-24 24s10.7 24 24 24z"/></svg>';
                break;
        }
        //obj.status = forecastData.daily.weather_code[i];
        objDay.min_temp = Math.round(forecastData.daily.temperature_2m_min[i]);
        objDay.max_temp = Math.round(forecastData.daily.temperature_2m_max[i]);
        dailyData.push(objDay);
    }
    dayWeathers.forEach((day_div, index) => {
        let currentTemp = Number($.getElementById('currentTemp').innerText.split('°')[0]);
        let rangeMax = Math.max(Math.abs(dailyData[index].min_temp), Math.abs(dailyData[index].max_temp));
        let rangeMin = -rangeMax;
        let gradMin = (100 - Math.floor((dailyData[index].min_temp / rangeMin) * 100)) / 2;
        let gradMax = (100 + Math.floor((dailyData[index].max_temp / rangeMax) * 100)) / 2;
        if (!index) {
            day_div.innerHTML = `
            <span>${dailyData[index].dayName}</span>
            ${dailyData[index].icon}
            <span>${dailyData[index].min_temp}°<sup>C</sup></span> <!--Low-->
            <input type="range" step="1" min="${rangeMin}" max="${rangeMax}" value="${currentTemp}" disabled>
            <span>${dailyData[index].max_temp}°<sup>C</sup></span>
            `;
            let rangeInput = $.querySelector('.dayWeather:first-child input');
            rangeInput.style.backgroundImage = `linear-gradient(to right, #eee ${gradMin}%, #12578f ${gradMin}%, #269bbe ${gradMax}%, #eee ${gradMax}%)`;
            console.log('First One : ', gradMin, gradMax);
        } else {
            day_div.innerHTML = `
            <span>${dailyData[index].dayName}</span>
            ${dailyData[index].icon}
            <span>${dailyData[index].min_temp}°<sup>C</sup></span> <!--Low-->
            <input type="range" step="1" min="${rangeMin}" max="${rangeMax}" disabled>
            <span>${dailyData[index].max_temp}°<sup>C</sup></span>
            `;
            let rangeInput = $.querySelector(`.dayWeather:nth-child(${index + 1}) input`);
            rangeInput.style.backgroundImage = `linear-gradient(to right, #eee ${gradMin}%, #12578f ${gradMin}%, #269bbe ${gradMax}%, #eee ${gradMax}%)`;
            console.log('Number ', index, ' : ', gradMin, gradMax);
        }
    });
    let highLow = $.querySelectorAll('#currentDetails span:not(:first-child)');
    highLow[0].innerHTML = `High:&nbsp${Math.round(forecastData.daily.temperature_2m_max[0])}°<sup>C</sup>&nbsp|`;
    highLow[1].innerHTML = `Low:&nbsp${Math.round(forecastData.daily.temperature_2m_min[0])}°<sup>C</sup>`;
}
function isNight() {
    let nowTempo = new Date();
    let comparisonNum;
    let args = Array.from(arguments);
    if (sunsetTime && sunsetTime) {
        //console.log('You have sunset/sunrise time');
        if (args.length) {
            //console.log('You have arg');
            if (args[0] - nowTempo.getHours() >= 0) {
                comparisonNum = nowTempo.getTime() / 1000 + (args[0] - nowTempo.getHours()) * (60 * 60);
            } else if (args[0] - nowTempo.getHours() < 0) {
                // The following code makes sense, but we don't have access to tomorrow's times.
                //comparisonNum = nowTempo.getTime() / 1000 + ((24 - nowTempo.getHours()) + args[0]) * (60 * 60);
                // So we'll do the job using the current day's data:
                comparisonNum = nowTempo.getTime() / 1000 - (nowTempo.getHours() - args[0]) * (60 * 60);
            }
        } else {
            //console.log('You dont have arg');
            comparisonNum = nowTempo.getTime() / 1000;
        }
        if (comparisonNum >= sunsetTime || comparisonNum < sunriseTime) {
            return true;
        } else return false;
    } else {
        //console.log("You DON'T have sunset/sunrise time");
        if (args.length) {
            //console.log('You have arg');
            comparisonNum = args[0];
        } else {
            //console.log('You dont have arg');
            comparisonNum = nowTempo.getHours()
        }
        if (comparisonNum > 17 || comparisonNum < 6) return true;
        else return false;
    }
}
function whichDayIsIt(dayNum) {
    if (dayNum > 6) dayNum -= 7 * (Math.floor(dayNum / 7));
    switch (dayNum) {
        case 0:
            return 'Sun';
        case 1:
            return 'Mon';
        case 2:
            return 'Tue';
        case 3:
            return 'Wed';
        case 4:
            return 'Thu';
        case 5:
            return 'Fri';
        case 6:
            return 'Sat';
        default:
            return '--';
    }
}
function interpretStatus(statusCode) {
    if (statusCode < 2) {
        return 'clear';
    }
    if (statusCode === 2) {
        return 'partly_cloudy';
    }
    if (statusCode === 3) {
        return 'cloudy';
    }
    if ((statusCode > 50 && statusCode < 69) || (statusCode >= 80 && statusCode < 85)) {
        return 'rainy'
    }
    if ((statusCode >= 70 && statusCode < 80) || statusCode === 85 || statusCode === 86) {
        return 'snowy';
    }
    if (statusCode > 94) {
        return 'thunderstorm';
    }
    return 'windy';
}
