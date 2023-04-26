export function fetchCountries(name) {
    const BASE_URL = "https://restcountries.com/v3.1/name/";
    const FIELDS = ["name", "capital", "population", "flags", "languages"];
    return fetch(`${BASE_URL}${name}?fields=${FIELDS.join(",")}`).then(
        (res) => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json();
        }
    );
}
