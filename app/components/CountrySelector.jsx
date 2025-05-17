import {Form, useMatches, useLocation, useFetcher} from '@remix-run/react';
import {useEffect, useState, useRef} from 'react';

export function CountrySelector({isMobile = false}) {
  const [root] = useMatches();
  const selectedLocale = root.data.selectedLocale;
  const {pathname, search} = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [countries, setCountries] = useState({});

  // Get available countries list
  const fetcher = useFetcher();
  useEffect(() => {
    if (!fetcher.data) {
      fetcher.load('/api/countries');
      return;
    }
    setCountries(fetcher.data);
  }, [fetcher.data]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const strippedPathname = pathname.replace(selectedLocale.pathPrefix, '');

  // Country flag emoji mapping
  const countryFlags = {
    MY: '🇲🇾',
    AU: '🇦🇺',
    SG: '🇸🇬',
    US: '🇺🇸',
  };

  // Mobile UI for sidebar navigation
  if (isMobile) {
    return (
      <div className="w-full py-2" ref={dropdownRef}>
        <div className="border-b border-gray-200 pb-3 mb-2">
          <p className="text-black mb-3">Region & Currency</p>
          <div
            className="flex items-center justify-between w-full py-2 px-3 bg-gray-50 rounded-md"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center">
              <span className="text-xl mr-2">
                {countryFlags[selectedLocale.country] || '🌐'}
              </span>
              <span className="font-medium">{selectedLocale.country}</span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>

        {isOpen && (
          <div className="bg-white rounded-md border border-gray-200 mb-4">
            {countries &&
              Object.keys(countries).map((countryKey) => {
                const locale = countries[countryKey];
                const hreflang = `${locale.language}-${locale.country}`;
                const isSelected = locale.country === selectedLocale.country;

                return (
                  <Form method="post" action="/locale" key={hreflang}>
                    <input
                      type="hidden"
                      name="language"
                      value={locale.language}
                    />
                    <input
                      type="hidden"
                      name="country"
                      value={locale.country}
                    />
                    <input
                      type="hidden"
                      name="path"
                      value={`${strippedPathname}${search}`}
                    />
                    <button
                      type="submit"
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 border-b border-gray-100 last:border-b-0 ${
                        isSelected ? 'bg-gray-50 font-medium' : ''
                      }`}
                    >
                      <span className="text-lg">
                        {countryFlags[locale.country] || '🌐'}
                      </span>
                      <span className="ml-2">{locale.label}</span>
                      {isSelected && (
                        <svg
                          className="w-5 h-5 ml-auto text-emerald-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  </Form>
                );
              })}
          </div>
        )}
      </div>
    );
  }

  // Desktop UI (original dropdown)
  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-lg mr-1">
          {countryFlags[selectedLocale.country] || '🌐'}
        </span>
        <span className="text-sm font-medium">{selectedLocale.country}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 border border-gray-200 py-1">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Select Region</p>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {countries &&
              Object.keys(countries).map((countryKey) => {
                const locale = countries[countryKey];
                const hreflang = `${locale.language}-${locale.country}`;
                const isSelected = locale.country === selectedLocale.country;

                return (
                  <Form method="post" action="/locale" key={hreflang}>
                    <input
                      type="hidden"
                      name="language"
                      value={locale.language}
                    />
                    <input
                      type="hidden"
                      name="country"
                      value={locale.country}
                    />
                    <input
                      type="hidden"
                      name="path"
                      value={`${strippedPathname}${search}`}
                    />
                    <button
                      type="submit"
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                        isSelected ? 'bg-gray-50 font-medium' : ''
                      }`}
                    >
                      <span className="text-lg">
                        {countryFlags[locale.country] || '🌐'}
                      </span>
                      <span className="ml-2">{locale.label}</span>
                      {isSelected && (
                        <svg
                          className="w-4 h-4 ml-auto text-emerald-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  </Form>
                );
              })}
          </div>
          <div className="px-3 py-2 border-t border-gray-100 text-xs text-gray-500">
            Currency will update based on region
          </div>
        </div>
      )}
    </div>
  );
}
