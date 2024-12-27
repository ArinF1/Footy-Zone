import { useEffect, useState } from "react";
import { DetailsView } from "../views/playerDetailsView.jsx";
import { observer } from "mobx-react-lite";
import loadingscreen from "/src/images/loadingscreen.png";
export const Details = observer(function Details(props) {
  const { model } = props;

  const [showNoStats, setShowNoStats] = useState(false);

  useEffect(() => {
    console.log(
      "Details useEffect triggered. currentPlayerId:",
      model.currentPlayerId
    );

    if (model.currentPlayerId && !model.currentPlayerPromiseState.data) {
      model.getPlayerStats(model.currentPlayerId);
    }

    const noStatsTimeout = setTimeout(() => {
      setShowNoStats(true);
    }, 1000);

    return () => {
      clearTimeout(noStatsTimeout); // Clear timeout on cleanup
    };
  }, [model.currentPlayerId, model.currentPlayerPromiseState.data]);

  function renderCB() {
    const promiseState = model.currentPlayerPromiseState;

    console.log("Rendering Details component with promiseState:", promiseState);

    // Check error state
    if (promiseState.error) {
      console.log("Error occurred:", promiseState.error);
      return <div>Error: {promiseState.error.toString()}</div>;
    }

    if (!promiseState.data) {
      if (!showNoStats) {
        // Show loading spinner before "No stats found" appears
        return (
          <div className="loading-details">
            <img src={loadingscreen} alt="Loading" />
          </div>
        );
      }

      // Show "No stats found" after timeout
      return (
        <div className="no-stats-found">
          <h3>No stats found</h3>
          <button onClick={() => (window.location.hash = "#/search")}>
            Back to Search
          </button>
        </div>
      );
    }

    // Check if data exists
    if (promiseState.data) {
      const { player, statistics: totalStats } = promiseState.data;

      console.log(
        "Passing player and totalStats to DetailsView:",
        player,
        totalStats
      );
      return (
        <div>
          <DetailsView
            player={player}
            totalStats={totalStats}
            addToFavorites={model.addToFavorites.bind(model)}
            removeFromFavorites={model.removeFromFavorites.bind(model)}
            favorites={model.favorites}
            isAnonymous={model.user.isAnonymous || false}
            showNotification={model.showNotification.bind(model)}
          />

        </div>
      );
    }

    // Show loading spinner as fallback
    return (
      <div className="loading-details">
        <img src={loadingscreen} alt="Loading" />
      </div>
    );
  }

  return (
    <div className="details-page">
      {renderCB()}
    </div>
  );
});
