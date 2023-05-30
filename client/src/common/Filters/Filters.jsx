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
      <div key='0-9' className='filter-check-container'>
        <input
          type="checkbox"
          value='0-9'
          onChange={() => setFilter('0-9')}
          id={'0-9'}
        >
        </input>
        <label htmlFor={'0-9'} className="filter-name">0-9</label>
      </div>
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
      <div key='other' className='filter-check-container'>
        <input
          type="checkbox"
          value='other'
          onChange={() => setFilter('other')}
          id={'other'}
        >
        </input>
        <label htmlFor={'other'} className="filter-name">Other</label>
      </div>
      <Reset />
    </fieldset>
  </>
}