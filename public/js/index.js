"use strict";
import CountryDetail from "./CountryDetail.js";

const countriesContainer = document.querySelector(".countries__container");
const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = function (match) {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );
  console.log(keys);

  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[1]];
    })
  );
};

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const routes = [
    { path: "/", view: () => console.log("Testing Root Route") },
    {
      path: "/country/:name",
      view: CountryDetail,
    },
  ];

  // Test each route for potential match
  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result !== null
  );

  if (!match) {
    match = {
      route: routes[0],
      isMatch: true,
    };
  }
  console.log(match);
  const view = new match.route.view(getParams(match));

  document.querySelector("#app").innerHTML = await view.getHTML();
};

window.addEventListener("popstate", router);

async function getCountries() {
  try {
    const countries = await fetch("https://restcountries.com/v3.1/region/asia");
    const countriesData = await countries.json();

    if (!countries.ok) {
      throw new Error(`HTTP Code ${countries.status}`);
    }

    countriesData.forEach((country) => {
      let htmlText = `
    <div class="countries__card">
      <a href="/country/${country.name.common}" class="countries__country-detail-link" data-link>
        <div class="countries__img-container">
        <img src="${country.flags.svg}" alt="${country.flags.alt}" class="countries__img-flag" />
        </div>
        
        <div class="countries__details-text-box">
        <p class="countries__name">${country.name.common}</p>
        
        <p class="countries__population"><span class="countries__detail-type">Population: </span>${country.population}</p>
        
        <p class="countries__region"><span class="countries__detail-type">Region: </span>${country.region}</p>
        
        <p class="countries__capital"><span class="countries__detail-type">Capital: </span>${country.capital}</p>
        </div>
        </a>
      </div>
      `;

      countriesContainer.insertAdjacentHTML("beforeend", htmlText);
    });
  } catch (error) {
    console.error(`catched ${error}`);
  }
}

getCountries();

document.addEventListener("DOMContentLoaded", () => {
  const targetNode = document.getElementById("countries__container");

  const config = { childList: true };

  const callback = () => {
    document.body.addEventListener("click", (e) => {
      if (e.target.matches("[data-link]")) {
        e.preventDefault();
        navigateTo(e.target.href);
      }
    });
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);

  router();
});

// const themeToggle = document.querySelector(".test");
// themeToggle.addEventListener("click", toggleTheme);

// function toggleTheme() {
//   const html = document.querySelector("html");
//   const currentTheme = html.getAttribute("data-theme");

//   if (currentTheme === "dark") {
//     setTheme("light");
//   } else {
//     setTheme("dark");
//   }
// }

// function setTheme(theme) {
//   const html = document.querySelector("html");
//   html.setAttribute("data-theme", theme);
// }
