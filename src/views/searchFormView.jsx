import { useState } from "react";
import messiImage from "/src/images/messi.png";
import ronaldoImage from "/src/images/ronaldo.png";
import logo from "/src/images/FootyZoneLogo.png";

export function SearchFormView(props) {
  const [topScorersVisible, setTopScorersVisible] = useState(true);
  const [topAssistersVisible, setTopAssistersVisible] = useState(false);

  // Handle the text change and search logic
  function searchTextChangeACB(e) {
    const text = e.target.value;
    props.onTextChange(text);
    props.onSearch(text);
  }

  // Compare button logic
  function compareButtonACB() {
    window.location.hash = "#/compare";
  }

  // Favorites button logic
  function favoritesButtonACB() {
    window.location.hash = "#/favorites";
  }

  // Handle form submission
  function searchSubmitACB(e) {
    e.preventDefault();
    props.onSearchSubmit();
  }

  // ACB for toggling the top scorers visibility
  function toggleTopScorersACB() {
    const newState = !topScorersVisible;
    setTopScorersVisible(newState);

    // Pass the toggling state to the presenter (Search)
    if (props.onToggleTopScorers) {
      props.onToggleTopScorers(newState);
    }

    if (props.resetPagination) props.resetPagination();
  }

  // ACB for toggling the top assisters visibility
  function toggleTopAssistersACB() {
    const newState = !topAssistersVisible;
    setTopAssistersVisible(newState);

    // Pass the toggling state to the presenter (Search)
    if (props.onToggleTopAssisters) {
      props.onToggleTopAssisters(newState);
    }

    if (props.resetPagination) props.resetPagination();
  }

  // Handle league change
  function leagueChangeACB(e) {
    if (props.onLeagueChange) {
      props.onLeagueChange(e); // Pass event to Presenter
    }
    if (props.resetPagination) props.resetPagination();
  }

  // Handle season change
  function seasonChangeACB(e) {
    if (props.onSeasonChange) {
      props.onSeasonChange(e); // Pass event to Presenter
    }
    if (props.resetPagination) props.resetPagination();
  }

  return (
    <div>
      <div className="image-container">
        <img src={logo} className="logo-image" alt="FootyZone Logo" />
        <img src={ronaldoImage} className="player-image-1" alt="Cristiano Ronaldo" />
        <img src={messiImage} className="player-image-2" alt="Lionel Messi" />
      </div>

      {props.showSearchBar && (
        <form className="search-bar" onSubmit={searchSubmitACB}>
          <input
            type="text"
            id="playerName"
            onChange={searchTextChangeACB}
            placeholder="Enter Player Name"
            className="search-input"
            value={props.text} // Controlled input
          />
          <button type="submit" className="search-button">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>

          {/* Toggle Buttons */}
          <div className="toggle-buttons">
            <button
              type="button"
              className={`top-toggle-button ${topScorersVisible ? "active" : ""}`}
              onClick={toggleTopScorersACB}
            >
              Top Scorers
            </button>
            <button
              type="button"
              className={`top-toggle-button ${topAssistersVisible ? "active" : ""}`}
              onClick={toggleTopAssistersACB}
            >
              Top Assisters
            </button>

            {/* Additional Buttons */}
            <button onClick={compareButtonACB} type="button" className="compare-favorites-button">
              Compare
            </button>
            <button onClick={favoritesButtonACB} type="button" className="compare-favorites-button">
              Favorites
            </button>
          </div>

          {/* Dropdown container */}
          {(topScorersVisible || topAssistersVisible) && (
            <div className="dropdowns-container">
              <div className="league-selector">
                <label htmlFor="league">Select League: </label>
                <select
                  id="league"
                  onChange={leagueChangeACB}
                  value={props.selectedLeague} // Use value from props
                >
                  <option value="Premier League">Premier League</option>
                  <option value="La Liga">La Liga</option>
                  <option value="Bundesliga">Bundesliga</option>
                  <option value="Serie A">Serie A</option>
                  <option value="Ligue 1">Ligue 1</option>
                </select>
              </div>

              <div className="season-selector">
                <label htmlFor="season">Select Season: </label>
                <select
                  id="season"
                  value={props.season} // Use value from props
                  onChange={seasonChangeACB}
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
