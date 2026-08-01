export interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  cities: string[];
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  {
    code: "BA",
    name: "Bosnia and Herzegovina",
    dialCode: "+387",
    flag: "🇧🇦",
    cities: ["Sarajevo", "Mostar", "Banja Luka", "Tuzla", "Zenica"],
  },
  {
    code: "HR",
    name: "Croatia",
    dialCode: "+385",
    flag: "🇭🇷",
    cities: ["Zagreb", "Split", "Rijeka", "Osijek"],
  },
  {
    code: "RS",
    name: "Serbia",
    dialCode: "+381",
    flag: "🇷🇸",
    cities: ["Belgrade", "Novi Sad", "Niš"],
  },
  {
    code: "SI",
    name: "Slovenia",
    dialCode: "+386",
    flag: "🇸🇮",
    cities: ["Ljubljana", "Maribor"],
  },
  {
    code: "ME",
    name: "Montenegro",
    dialCode: "+382",
    flag: "🇲🇪",
    cities: ["Podgorica", "Budva"],
  },
  {
    code: "MK",
    name: "North Macedonia",
    dialCode: "+389",
    flag: "🇲🇰",
    cities: ["Skopje"],
  },
  {
    code: "AT",
    name: "Austria",
    dialCode: "+43",
    flag: "🇦🇹",
    cities: ["Vienna"],
  },
  {
    code: "DE",
    name: "Germany",
    dialCode: "+49",
    flag: "🇩🇪",
    cities: ["Munich", "Berlin"],
  },
  {
    code: "CH",
    name: "Switzerland",
    dialCode: "+41",
    flag: "🇨🇭",
    cities: ["Zurich"],
  },
  {
    code: "US",
    name: "United States",
    dialCode: "+1",
    flag: "🇺🇸",
    cities: ["New York", "Los Angeles", "Chicago"],
  },
];

export function findCountryByName(name: string | null | undefined): CountryOption | undefined {
  if (!name) return undefined;
  return COUNTRY_OPTIONS.find((country) => country.name === name);
}

export function findCountryByDialCode(dialCode: string): CountryOption | undefined {
  return COUNTRY_OPTIONS.find((country) => country.dialCode === dialCode);
}

/** Split a stored phone into dial code + local number when possible. */
export function splitPhone(phone: string | null | undefined): {
  dialCode: string;
  localNumber: string;
} {
  const value = phone?.trim() ?? "";
  if (!value) {
    return { dialCode: "+387", localNumber: "" };
  }

  const match = COUNTRY_OPTIONS.find((country) => value.startsWith(country.dialCode));
  if (match) {
    return {
      dialCode: match.dialCode,
      localNumber: value.slice(match.dialCode.length).trim(),
    };
  }

  return { dialCode: "+387", localNumber: value };
}

export function joinPhone(dialCode: string, localNumber: string): string {
  const number = localNumber.trim();
  if (!number) return "";
  return `${dialCode} ${number}`.trim();
}
