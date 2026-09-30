import * as isoCountries from "i18n-iso-countries";
import localeEn from "i18n-iso-countries/langs/en.json";

isoCountries.registerLocale(localeEn);

export interface Country {
  name: string;
  code: string;
}

export const COUNTRIES: Country[] = Object.entries(
  isoCountries.getNames("en", { select: "official" }),
)
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name));
