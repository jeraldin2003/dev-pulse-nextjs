const getTotalCountries = (countries) => countries.length;

const sortByPopulationDescending = (countries) =>
  [...countries].sort((a, b) => b.population - a.population);

const getTop10CountriesByPopulation = (countries) =>
  sortByPopulationDescending(countries)
    .slice(0, 10)
    .map(({ name, population }) => ({
      name: name.common,
      population,
    }));

export const countryLookup = (countries) => {
  const totalCountries = getTotalCountries(countries);
  const top10CountriesByPopulation = getTop10CountriesByPopulation(countries);

  return {
    totalCountries,
    top10CountriesByPopulation,
  };
};
