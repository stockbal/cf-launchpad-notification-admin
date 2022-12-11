export type Locale = string;

export interface Countries {
  name: string;
  descr: string;
  code: string;
  texts?: CountriesTexts[];
  localized?: CountriesTexts;
}

export interface CountriesTexts {
  locale: Locale;
  name: string;
  descr: string;
  code: string;
}

export interface Currencies {
  name: string;
  descr: string;
  code: string;
  symbol: string;
  texts?: CurrenciesTexts[];
  localized?: CurrenciesTexts;
}

export interface CurrenciesTexts {
  locale: Locale;
  name: string;
  descr: string;
  code: string;
}

export interface Languages {
  name: string;
  descr: string;
  code: Locale;
  texts?: LanguagesTexts[];
  localized?: LanguagesTexts;
}

export interface LanguagesTexts {
  locale: Locale;
  name: string;
  descr: string;
  code: Locale;
}

export enum Entity {
  Countries = "sap.common.Countries",
  CountriesTexts = "sap.common.Countries.texts",
  Currencies = "sap.common.Currencies",
  CurrenciesTexts = "sap.common.Currencies.texts",
  Languages = "sap.common.Languages",
  LanguagesTexts = "sap.common.Languages.texts"
}

export enum SanitizedEntity {
  Countries = "Countries",
  CountriesTexts = "CountriesTexts",
  Currencies = "Currencies",
  CurrenciesTexts = "CurrenciesTexts",
  Languages = "Languages",
  LanguagesTexts = "LanguagesTexts"
}
