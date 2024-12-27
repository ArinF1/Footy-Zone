import { useState, useEffect } from "react";

export function TopPlayersView({ topScorers, topAssisters, showTopScorers, showTopAssisters, onPlayerClick }) {
  const [showTopPlayers, setShowTopPlayers] = useState(false);

  useEffect(() => {
    // Show top players ONLY if the array is not empty
    setShowTopPlayers(topScorers.length !== 0 || topAssisters.length !== 0);
  }, [topScorers, topAssisters]);


  const getRankClass = (globalIndex) => {
    if (showTopScorers || showTopAssisters) {
      if (globalIndex === 0) return "first-place";
      if (globalIndex === 1) return "second-place";
      if (globalIndex === 2) return "third-place";
    }
    return "other-places";
  };

  const playerClickACB = (player) => {
    onPlayerClick(player); // Call the provided callback
    window.location.hash = "#/details"; // Update the hash location
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

  return (
    <div>
      {showTopPlayers && (
        <div className="top-players-container">
          {currentPlayers.length > 0 ? (
            <div className="search-results-container">
              {currentPlayers.map((player, index) =>
                createPlayerElement(player, index, index)
              )}
            </div>
          ) : (
            <div className="no-results-message">No players found for the selected filters.</div>
          )}
        </div>
      )}
    </div>
  );
}
