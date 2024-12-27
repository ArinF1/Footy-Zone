import { useState, useEffect } from "react";
import { SearchResultsView } from "./searchResultsView";
import RadarChart from "../reactjs/RadarChart";
import { utilRadarCharts } from "../footyUtilities";

export default function PlayerComparisonView({
  onSelectPlayerA,
  onSelectPlayerB,
  onResetPlayers,
  searchContext,
  onTextChange,
  searchResults,
  onPlayerClick,
  playerA,
  playerB,
}) {


  function renderRadarComparisonCB() {
    if (!playerA?.totalStats && !playerB?.totalStats) return null;

    const radarData = utilRadarCharts(
      playerA?.totalStats || {},
      playerA?.name || "Player A",
      playerB?.totalStats || {},
      playerB?.name || "Player B",
    );

    return (
      <div className="comparison-radar-container">
        <h3 className="radar-title">RadarChart Comparison</h3>
        <div>
          <RadarChart chartData={radarData} />
        </div>
        <div className="radar-legend">
          {playerA && (
            <div className="legend-item">
              <span className="legend-color player-a"></span>
              <span>{playerA.name}</span>
            </div>
          )}
          {playerB && (
            <div className="legend-item">
              <span className="legend-color player-b"></span>
              <span>{playerB.name}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const [isSearchbarVisible, setIsSearchbarVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(searchInput);

  useEffect(() => {
    const typeHandler = setTimeout(() => {
      setDebouncedValue(searchInput);
    }, 500);

    return () => clearTimeout(typeHandler);
  }, [searchInput]);

  useEffect(() => {
    onTextChange(debouncedValue);
  }, [debouncedValue]);

  function handleCircleClickCB(context) {
    if (context === "A") {
      onSelectPlayerA();
    } else if (context === "B") {
      onSelectPlayerB();
    }
    setIsSearchbarVisible(true);
  };

  function closeSearchbarCB()  {
    setIsSearchbarVisible(false);
  };

  function getStatStyleCB(playerStat, comparisonStat) {
    if (playerStat > comparisonStat) return { backgroundColor: "green", color: "white" };
    if (playerStat < comparisonStat) return { backgroundColor: "red", color: "white" };
    return { backgroundColor: "gray", color: "white" }; // Equal stats
  };

  function renderPlayersInformationComparisonCB() {
    const infoKeys = [
      { key: "birth.date", label: "Date of Birth" },
      { key: "nationality", label: "Nationality" },
      { key: "position", label: "Position" },
      { key: "height", label: "Height" },
      { key: "weight", label: "Weight" },
    ];

    if (!playerA && !playerB) return null;



    return (
      <div className="comparison players-info-box">
        <h3 className="players-info-title">Players Information</h3>
        <div className="comparison-info-grid">
          {infoKeys.map(({ key, label }) => {
            let playerAInfo = playerA?.[key] || "";
            let playerBInfo = playerB?.[key] || "";

            if (key === "birth.date") {
              playerAInfo = playerA?.birth?.date || "";
              playerBInfo = playerB?.birth?.date || "";
            }

            if (key === "position") {
              playerAInfo = playerA?.totalStats?.position || playerA?.position || "";
              playerBInfo = playerB?.totalStats?.position || playerB?.position || "";
            }

            return (
              <div key={key} className="comparison-info-row">
                <div className="info-player-a">{playerAInfo}</div>
                <div className="info-category">{label}</div>
                <div className="info-player-b">{playerBInfo}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  function renderStatisticsComparisonCB() {
    const statsKeys = [
      { key: "goals", label: "Goals" },
      { key: "assists", label: "Assists" },
      { key: "avgRating", label: "Average Rating" },
      { key: "shots", label: "Shots" },
      { key: "appearances", label: "Appearances" },
      { key: "passes", label: "Passes" },
      { key: "dribbleSuccess", label: "Dribbles/Dribble Success Rate" },
      { key: "tackles", label: "Tackles" },
      { key: "duelsTotal", label: "Duels Total" },
      { key: "cardsYellow", label: "Yellow Cards" },
      { key: "cardsRed", label: "Red Cards" },
      { key: "foulsCommitted", label: "Fouls Committed" },
      { key: "minutes", label: "Minutes Played" },
    ];

    if ((!playerA || !playerA.totalStats) && (!playerB || !playerB.totalStats)) return null;

    return (
      <div className="comparison statistics-box">
        <h3 className="statistics-box-title">Statistics Comparison</h3>
        <div className="comparison-statistics-grid">
          {statsKeys.map(({ key, label }) => {
            let playerAStat = playerA?.totalStats?.[key] || 0;
            let playerBStat = playerB?.totalStats?.[key] || 0;

            if (key === "dribbleSuccess") {
              const playerADribbleAttempts = playerA?.totalStats?.dribbleAttempts || 0;
              const playerBDribbleAttempts = playerB?.totalStats?.dribbleAttempts || 0;

              const playerASuccessRate = playerADribbleAttempts
                ? ((playerAStat / playerADribbleAttempts) * 100).toFixed(0) + "%"
                : "0%";
              const playerBSuccessRate = playerBDribbleAttempts
                ? ((playerBStat / playerBDribbleAttempts) * 100).toFixed(0) + "%"
                : "0%";

              playerAStat = `${playerADribbleAttempts} / ${playerASuccessRate}`;
              playerBStat = `${playerBDribbleAttempts} / ${playerBSuccessRate}`;
            } else if (key === "avgRating") {
              playerAStat = parseFloat(playerAStat).toFixed(2);
              playerBStat = parseFloat(playerBStat).toFixed(2);
            }

            return (
              <div className="comparison-stat-row" key={key}>
                <div className="stat-item player-a" style={getStatStyleCB(playerAStat, playerBStat)}>
                  {playerAStat}
                </div>
                <div className="stat-category">{label}</div>
                <div className="stat-item player-b" style={getStatStyleCB(playerBStat, playerAStat)}>
                  {playerBStat}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  function renderSearchbarPopupCB() {
    return (
      isSearchbarVisible && (
        <div className="comparison-search-bar-container">
          <div className="popup">
            <button className="close-button" onClick={closeSearchbarCB}>X</button>

            <input
              type="text"
              className="comparison-search-input"
              placeholder={`Search for Player ${searchContext}`}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <SearchResultsView
              searchResults={searchResults}
              onPlayerClick={(player) => {
                onPlayerClick(player);
                closeSearchbarCB();
              }}
            />
          </div>
        </div>
      )
    );
  };

  return (
    <div className="player-comparison-container">
      <div className="player-profiles-section">
        <div className="reset-button-container">
          <button className="reset-button" onClick={onResetPlayers}>Reset Players</button>
        </div>
        <div className="player-section">
          <div className="player-box" onClick={() => handleCircleClickCB("A")}>
            {playerA ? (
              <img src={playerA.photo} alt="Player A" className="player-img" />
            ) : (
              <p>Search Player A</p>
            )}
          </div>
          {playerA && <div className="comparison player-name-container"><p className="comparison player-name">{playerA.name}</p></div>}
        </div>
        <div className="vs-container">
          <span className="vs-text">VS</span>
        </div>
        <div className="player-section">
          <div className="player-box" onClick={() => handleCircleClickCB("B")}>
            {playerB ? (
              <img src={playerB.photo} alt="Player B" className="player-img" />
            ) : (
              <p>Search Player B</p>
            )}
          </div>
          {playerB && <div className="comparison player-name-container"><p className="comparison player-name">{playerB.name}</p></div>}
        </div>
      </div>

      {(playerA || playerB) && (
        <>
          {renderPlayersInformationComparisonCB()}
          <div className="statistics-section">
            {renderStatisticsComparisonCB()}
          </div>
        </>
      )}
      {renderSearchbarPopupCB()}
      {(playerA || playerB) && renderRadarComparisonCB()}
    </div>
  );
}
