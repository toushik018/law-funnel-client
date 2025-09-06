import React from "react";
import countries from "world-countries";

interface Country {
  cca2: string;
  name: {
    common: string;
  };
  flag: string;
  idd: {
    root?: string;
    suffixes?: string[];
  };
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  defaultCountry?: string;
}

// Priority countries with Germany first
const priorityCountries = [
  "DE",
  "BD",
  "US",
  "GB",
  "FR",
  "IT",
  "ES",
  "NL",
  "AT",
  "CH",
  "IN",
  "CA",
  "AU",
];

// Get country dial code
const getDialCode = (country: Country): string => {
  if (!country.idd.root) return "";
  const suffix = country.idd.suffixes?.[0] || "";
  return `${country.idd.root}${suffix}`;
};

// Filter and sort countries
const getPhoneCountries = (): Country[] => {
  const filteredCountries = countries.filter((country: Country) => {
    return priorityCountries.includes(country.cca2) && country.idd.root;
  });

  // Sort by priority
  return filteredCountries.sort((a, b) => {
    const aIndex = priorityCountries.indexOf(a.cca2);
    const bIndex = priorityCountries.indexOf(b.cca2);
    return aIndex - bIndex;
  });
};

const phoneCountries = getPhoneCountries();

// Get country by code
const getCountryByCode = (code: string): Country | undefined => {
  return phoneCountries.find((country) => country.cca2 === code);
};

// Extract country code and phone number from full phone string
const parsePhoneNumber = (
  phone: string
): { countryCode: string; phoneNumber: string } => {
  if (!phone) return { countryCode: "DE", phoneNumber: "" };

  // Try to match with known dial codes
  for (const country of phoneCountries) {
    const dialCode = getDialCode(country);
    if (dialCode && phone.startsWith(dialCode)) {
      return {
        countryCode: country.cca2,
        phoneNumber: phone.slice(dialCode.length).trim(),
      };
    }
  }

  return { countryCode: "DE", phoneNumber: phone };
};

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Telefonnummer eingeben",
  defaultCountry = "DE",
}) => {
  const { countryCode, phoneNumber } = parsePhoneNumber(value);
  const currentCountry =
    getCountryByCode(countryCode) || getCountryByCode(defaultCountry)!;

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountryCode = e.target.value;
    const newCountry = getCountryByCode(newCountryCode);
    if (newCountry) {
      const dialCode = getDialCode(newCountry);
      const newValue = phoneNumber ? `${dialCode} ${phoneNumber}` : dialCode;
      onChange(newValue);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    const dialCode = getDialCode(currentCountry);
    const newValue = newPhoneNumber
      ? `${dialCode} ${newPhoneNumber}`
      : dialCode;
    onChange(newValue);
  };

  return (
    <div className="flex border border-border rounded-md overflow-hidden bg-input focus-within:border-primary focus-within:ring-1 focus-within:ring-ring transition-colors">
      {/* Country Selection */}
      <div className="relative">
        <select
          value={countryCode}
          onChange={handleCountryChange}
          disabled={disabled}
          className="appearance-none bg-transparent border-0 border-r border-border px-3 py-2 text-sm disabled:bg-muted disabled:text-muted-foreground focus:outline-none pr-8 min-w-[80px]"
        >
          {phoneCountries.map((country) => (
            <option key={country.cca2} value={country.cca2}>
              {country.flag} {getDialCode(country)}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-3 h-3 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Phone Number Input */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-0 px-3 py-2 text-sm disabled:bg-muted disabled:text-muted-foreground focus:outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
};

export default PhoneInput;
