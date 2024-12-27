import { useState, useEffect } from "react";
import { TopPlayersView } from "./topPlayersView"; 

export function SearchResultsView(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 10;

  const {
    searchResults = [],
    topScorers = [],
    topAssisters = [],
    onPlayerClick,
    showTopScorers,
    showTopAssisters,
  } = props;

  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    // Show search results ONLY if user has typed
    setShowSearchResults(searchResults.length !== 0);
  }, [searchResults]);

  const currentPlayers = (() => {
    const indexOfLastPlayer = currentPage * playersPerPage;
    const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;

    if (showSearchResults) return searchResults.slice(indexOfFirstPlayer, indexOfLastPlayer);
    return [];
  })();

  const totalPages = Math.ceil(searchResults.length / playersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getRankClass = (globalIndex) => {
    return "other-places";
  };

  const playerClickACB = (player) => {
    onPlayerClick(player); // Call the provided callback
  };

  const createPlayerElement = (player, index, globalIndex) => (
    <div
      key={`${player.id}-${index}`}
      className="player-item"
      onClick={() => playerClickACB(player)}
    >
      {player.photo && (
        <div className="player-photo-container">
          <img src={player.photo} alt={player.name} />
        </div>
      )}
      <span className={`player-rank ${getRankClass(globalIndex)}`}>{globalIndex + 1}</span>
      <span className="player-name">{player.name}</span>
    </div>
  );

  const globalIndex = (index) => index + (currentPage - 1) * playersPerPage;

  return (
    <div>
      {/* Player List */}
      {showSearchResults && (
        <div className="search-results-container">
          {currentPlayers.map((player, index) =>
            createPlayerElement(player, index, globalIndex(index))
          )}
        </div>
      )}

      {/* Use TopPlayersView for top scorers and assisters */}
      <TopPlayersView
        topScorers={topScorers}
        topAssisters={topAssisters}
        showTopScorers={showTopScorers}
        showTopAssisters={showTopAssisters}
        onPlayerClick={onPlayerClick}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Prev
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}