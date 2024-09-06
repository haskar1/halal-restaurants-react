import styles from "../app/best-halal-restaurants/[location]/styles.module.css";
import FilterCuisines from "@/components/FilterCuisines";
import FilterPrice from "@/components/FilterPrice";
import FilterOther from "@/components/FilterOther";

export default function SearchResultsFilters({
  clearFilters,
  filtersAreSelected,
  cuisines,
  selectedCuisines,
  setSelectedCuisines,
  prices,
  selectedPrices,
  setSelectedPrices,
  others,
  selectedOthers,
  setSelectedOthers,
}) {
  return (
    <>
      <div className={styles.filters}>
        <div className="pb-4">
          <p className="font-bold text-2xl pb-2">
            Filters
            {filtersAreSelected &&
              ` (${
                selectedCuisines.length +
                selectedPrices.length +
                selectedOthers.length
              })`}
          </p>
          <div className="h-7">
            {filtersAreSelected ? (
              <button className={styles.clear_button} onClick={clearFilters}>
                Clear filters
              </button>
            ) : (
              <hr className="m-0" />
            )}
          </div>
        </div>

        <div className="grid gap-4">
          <FilterCuisines
            cuisines={cuisines}
            selectedCuisines={selectedCuisines}
            setSelectedCuisines={setSelectedCuisines}
          />
          <FilterPrice
            prices={prices}
            selectedPrices={selectedPrices}
            setSelectedPrices={setSelectedPrices}
          />
          <FilterOther
            others={others}
            selectedOthers={selectedOthers}
            setSelectedOthers={setSelectedOthers}
          />
        </div>
      </div>
    </>
  );
}
