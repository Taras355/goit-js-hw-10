import "./css/styles.css";
import debounce from "lodash.debounce";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { fetchCountries } from "./fetchCountries";

const DEBOUNCE_DELAY = 300; // debounce delay (ms) for typing input
const LIST_SIZE_LIMIT = 10; // maximum amount of counries that will be drawn
const DRAW_LARGE_LIMIT = 1; // amount of countries that will get full card displayed

const inputEl = document.querySelector("#search-box");
const countryListEl = document.querySelector(".country-list");
const countryInfoEl = document.querySelector(".country-info");

inputEl.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

function onInput({ target: { value } }) {
    value = value.trim();
    // console.log(value);
    if (!value) {
        countryListEl.innerHTML = "";
        countryInfoEl.innerHTML = "";
        inputEl.removeAttribute("style");
        return;
    }
    fetchCountries(value)
        .then((res) => {
            if (res.length > LIST_SIZE_LIMIT) {
                Notify.info(
                    "Too many matches found. Please enter a more specific name."
                );
                inputEl.removeAttribute("style");
                countryListEl.innerHTML = "";
                countryInfoEl.innerHTML = "";
                return;
            }
            if (res.length > DRAW_LARGE_LIMIT) {
                // console.log("drawing MULTIPLE countries");
                countryInfoEl.innerHTML = "";
                inputEl.removeAttribute("style");
                inputEl.style.outlineColor = "rgba(0, 128, 0, 0.9)";
                countryListEl.innerHTML = drawMarkupSmall(res);
                return;
            }
            // console.log("drawing ONE country");
            countryListEl.innerHTML = "";
            inputEl.style.outlineColor = "rgba(0, 128, 0, 0.9)";
            inputEl.style.backgroundColor = "rgba(0, 128, 0, 0.05)";
            countryInfoEl.innerHTML = drawMarkupLarge(res);
        })
        .catch((err) => {
            console.dir(err);
            inputEl.removeAttribute("style");
            countryListEl.innerHTML = "";
            countryInfoEl.innerHTML = "";
            if (err.message === "Not Found") {
                Notify.failure("Oops, there is no country with that name");
                return;
            }
            Notify.failure("Something went wrong");
        });
}

function drawMarkupSmall(countries) {
    return countries
        .map(({ name, flags }) => {
            return `<li class="country-item"><img src="${flags.svg}" alt="${name.official}" width="50"><p>${name.official}</p></li>`;
        })
        .join("");
}

function drawMarkupLarge(countries) {
    return countries
        .map(({ name, capital, population, flags, languages }) => {
            return `
            <div class="country-card">
            <div class="country-header">
                <img src="${flags.svg}" alt="${name.official}" width="75" />
                <h1>${name.official}</h1>
            </div>
            <p class="country-text"><span class="country-descriptor">Capital:</span> ${capital}</p>
            <p class="country-text"><span class="country-descriptor">Population:</span> ${population.toLocaleString(
                "uk-UA"
            )}</p>
            <p class="country-text"><span class="country-descriptor">Languages:</span>
            ${Object.values(languages).join(", ")}</p>
            </div>`;
        })
        .join("");
}
