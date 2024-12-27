export function TopNavBarView({
  onSearch,
  searchResults,
  onPlayerClick,
  showExtraButtons,
  isAnonymous // Add a prop to control visibility of the search bar
}) {

  function compareButtonACB() {
    window.location.hash = "#/compare";
  }

  function favoritesButtonACB() {
    window.location.hash = "#/favorites";
  }

  function handleLogoutACB() {
    window.location.hash = "#/login";
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <button
          onClick={() => (window.location.hash = "#/search")}
          className="navbar-search-button"
        >
          FOOTYZONE
        </button>
      </div>

      {showExtraButtons && (
        <>
      <div className="navbar-search-container">
        <form
          className="navbar-search-bar"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search for Player..."
            onChange={(e) => onSearch(e.target.value)}
          />

          <button
            type="submit"
            className="navbar-search-button"
          >
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>

          {searchResults.length > 0 && (
            <div className="dropdown">
              {searchResults.slice(0, 100).map((player) => (
                <div
                  key={player.id}
                  className="navbar-dropdown-item"
                  onClick={() => onPlayerClick(player)}
                >
                  <img
                    src={player.player.photo}
                    className="navbar-player-photo"  
                    alt={player.player.name}
                  />
                  <span className="navbar-player-name">
                    {player.player.name} {/* Render the player name */}
                  </span>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>

        <div className="navbar-links">
          <button onClick={compareButtonACB} className="navbar-button">
            Compare
          </button>
          <button onClick={favoritesButtonACB} disabled={isAnonymous} className="navbar-button">
            Favorites
          </button>
        </div>
        </>
      )}

      <div className="navbar-logout">
        <button 
          onClick={isAnonymous ? () => (window.location.hash = "#/login") : handleLogoutACB} 
          className="navbar-button">
          {isAnonymous ? "Login" : "Logout"}
        </button>
      </div>
    </nav>
  );
}
