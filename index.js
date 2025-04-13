const userTab = document.querySelector("[data-userweather]");
const SearchTab = document.querySelector("[data-searchweather]");
const usercontainer = document.querySelector(".weather-container");

const grantaccesscontainer = document.querySelector(".grant-location");
const searchform = document.querySelector("[data-searchform]");
const loadingscreen = document.querySelector(".loading-container");
const userinfocontainer = document.querySelector(".user-info-container");

let curr_tab = userTab;
curr_tab.classList.add("curr-tab");
API_Key = "532a8d87485873090ea4d66772660516";
getfromsessiontorage();

//switching tab

function switchtab(clickedtab) {
    if (clickedtab != curr_tab) {
        curr_tab.classList.remove("curr-tab");
        curr_tab = clickedtab;
        curr_tab.classList.add("curr-tab");

        if (!searchform.classList.contains("active")) {
            userinfocontainer.classList.remove("active");
            grantaccesscontainer.classList.remove("active");
            searchform.classList.add("active");
        }
        else {
            searchform.classList.remove("active");
            userinfocontainer.classList.remove("active");
            getfromsessiontorage();
        }
    }
}

SearchTab.addEventListener("click", () => {
    switchtab(SearchTab);
})

userTab.addEventListener("click", () => {
    switchtab(userTab);
})


function getfromsessiontorage() {
    const localcoordinates = sessionStorage.getItem("user-coordinates");
    if (!localcoordinates) {
        grantaccesscontainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localcoordinates);
        fetchuserweatherinfo(coordinates);
    }
}

async function fetchuserweatherinfo(coordinates) {
    const { lat, lon } = coordinates;
    grantaccesscontainer.classList.remove("active");

    loadingscreen.classList.add("active");

    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}&units=metric`)
        const data = await res.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch (err) {
        //homework
        loadingscreen.classList.remove("active");
    }

}

function renderweatherinfo(data) {
    const cityname = document.querySelector("[data-cityname]");
    const countryicon = document.querySelector("[data-countryicon]")
    const desc = document.querySelector("[data-weatherdesc]")
    const weathericon = document.querySelector("[data-weathericon]")
    const temp = document.querySelector("[data-temp]")
    const windspeed = document.querySelector("[data-windspeed]")
    const humidity = document.querySelector("[data-humidity]")
    const cloudiness = document.querySelector("[data-cloudiness]")

    console.log(data);

    cityname.innerText = data?.name;
    countryicon.src = `https://flagcdn.com/16x12/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weathericon.src = `https://openweathermap.org/img/wn/${data?.weather?.[0].icon}.png`;

    temp.innerText = `${data?.main?.temp}°C`;
    windspeed.innerText = `${data?.wind?.speed}m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    cloudiness.innerText = `${data?.clouds?.all}%`;
}

function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else {
        alert("Geolocation is not supported by this browser.");
    }
}


function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchuserweatherinfo(userCoordinates);
}

const grantaccessbtn = document.querySelector("[data-grantaccess]");
grantaccessbtn.addEventListener("click", getlocation);

const searchinput = document.querySelector("[data-searchInput]");

searchform.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityname = searchinput.value;

    if (cityname ==="") {
        return;
    }
    else {
        fetchuserweatherbycity(cityname);
        searchinput.value = "";
    }

})

async function fetchuserweatherbycity(city) {
    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantaccesscontainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}&units=metric`);
        const data = await response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch (err) {
        loadingscreen.classList.remove("active");
        // You could show an error message to the user here
        console.error("Failed to fetch weather data:", err);
    }
}