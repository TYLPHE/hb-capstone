import './Filters.css'

export default function Filters(params) {
  const { filters, setFilters, handleAddFilters, handleRmFilters } = params;
  const filterArr = Array.from(Array(26)).map((e, i) => i + 65);
  
  function setFilter(letter) {
    (filters.includes(letter)) ? handleRmFilters(letter) : handleAddFilters(letter);
  }
  
  function Reset() {
    return <>
      <button className='reset-filter-btn' onClick={() => setFilters([])}>
        Reset filters
      </button>
    </>
  }
  
  return <>
    <fieldset>
      <legend>Filters</legend>
      <Reset />
      <details open>
        <summary>A - Z</summary>
          {filterArr.map((charCode) => {
            const letter = String.fromCharCode(charCode);
            return <div key={letter} className='filter-check-container'>
              <input
                type="checkbox"
                value={letter}
                onChange={() => setFilter(letter)}
                id={letter}
                checked={filters.includes(letter)}
              >
              </input>
              <label htmlFor={letter} className="filter-name">{letter}</label>
            </div>
          })}

      </details>

    </fieldset>
  </>
}