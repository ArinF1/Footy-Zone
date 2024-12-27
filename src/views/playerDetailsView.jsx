import PlayerProfile from "./playerProfile";
import RadarChart from "../reactjs/RadarChart";
import { utilRadarCharts } from "../footyUtilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTimes, faBalanceScale } from "@fortawesome/free-solid-svg-icons";

export function DetailsView({ player, totalStats, addToFavorites, favorites, isAnonymous, showNotification, removeFromFavorites  }) {
  const isFavorite = favorites.some((fav) => fav.id === player.id);
  const radarData = utilRadarCharts(totalStats, player.name);

  function disableFavoriteBtn() {
    return isFavorite || isAnonymous;
  }

  function backToSearchACB() {
    window.location.hash = "#/search";
  }
  function handleAddToACB() {
    if (isFavorite) {
      showNotification(
        `${player.name} is already in your favorites.`,
        "info" 
      );
    } else {
      const success = addToFavorites(player);
      if (success) {
        showNotification(
          `${player.name} has been added to favorites!`,
          "success",
          () => removeFromFavorites(player.id), 
          "Undo"
        );
      } else {
        showNotification(
          `Unable to add ${player.name} to favorites.`,
          "error"
        );
      }
    }
  }

  function goToComparison() {
    localStorage.setItem("comparisonPlayerA", JSON.stringify(player));
    window.location.hash = "#/compare";
  }

  return (
    <div className="details-view">
      <div className="icon-buttons">
        <FontAwesomeIcon icon={faTimes} onClick={backToSearchACB} className="icon-btn close-btn" title="Back to Search" />
        <FontAwesomeIcon
          icon={faHeart}
          onClick={!disableFavoriteBtn() ? handleAddToACB : null} // Prevent click when disabled
          className={`icon-btn favorite-btn ${disableFavoriteBtn() ? "disabled" : ""}`} 
          title={
            isFavorite
              ? "Already in Favorites"
              : isAnonymous
                ? "Favorites Disabled (Anonymous)"
                : "Add to Favorites"
          }
        />
        <FontAwesomeIcon
          icon={faBalanceScale}
          onClick={goToComparison}
          className="icon-btn compare-btn"
          title="Comparison"
        />
      </div>
      <PlayerProfile player={player} totalStats={totalStats} />

      <div className="player-radar-chart">
        <h3>Player Performance</h3>
        <div className="radar-chart-container"> 
          <RadarChart chartData={radarData} />  
        </div>
      </div>
    </div>
  );
}
