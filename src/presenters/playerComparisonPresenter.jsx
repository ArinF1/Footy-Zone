import PlayerComparisonView from "../views/playerComparisonView.jsx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

export const Compare = observer(function Compare(props) {
  const { model } = props;

  /* function for local storage of player info, will load player details page to comp. page */
  useEffect(() => {
    const storedPlayerA = localStorage.getItem("comparisonPlayerA");
    if (storedPlayerA) {
      const playerA = JSON.parse(storedPlayerA);
      model.setPlayerA(playerA);
      model.getPlayerStats(playerA.id).then((stats) => {
        if (stats && stats.statistics) {
          playerA.totalStats = stats.statistics;
          model.setPlayerA(playerA);
        } else {
          console.error("No stats found for Player A");
        }
      });
      localStorage.removeItem("comparisonPlayerA"); // clears after use
    }
  }, []);

  function handleResetPlayersCB() {
    model.setPlayerA(null);
    model.setPlayerB(null);
  };

  function handleSelectPlayerCB(context) {
    model.clearSearchResults();
    model.setSearchContext(context);
    model.setCompareSearchParam({ text: "" });
    model.doCompareSearch();
  };

  function handleCompareTextChangeCB(text) {
    model.clearSearchResults();
    model.setCompareSearchParam({ text });
   model.doCompareSearch();
  };

  async function handleSelectPlayerForComparisonACB(player) {
    const context = model.searchContext;
    if (context === "A") {
      model.setPlayerA(player);
      model.getPlayerStats(player.id).then((stats) => {
        if (stats && stats.statistics) {
          player.totalStats = stats.statistics;
          model.setPlayerA(player);
        } else {
          console.error("No stats found for Player A");
        }
      });
    } else if (context === "B") {
      model.setPlayerB(player);
      model.getPlayerStats(player.id).then((stats) => {
        if (stats && stats.statistics) {
          player.totalStats = stats.statistics;
          model.setPlayerB(player);
        } else {
          console.error("No stats found for Player B");
        }
      });
    }
    model.clearSearchResults();
  };

  const searchResults =
    model.compareSearchResultsPromiseState.data?.response?.map((playerData) => ({
      id: playerData.player.id,
      name: playerData.player.name,
      firstname: playerData.player.firstname,
      lastname: playerData.player.lastname,
      age: playerData.player.age,
      photo: playerData.player.photo,
      birth: playerData.player.birth,
      nationality: playerData.player.nationality,
      height: playerData.player.height,
      weight: playerData.player.weight,
      position: playerData.player.position,
    })) || [];

  const topScorers =
    model.topScorersPromiseState?.data?.map((playerData) => ({
      id: playerData.player.id,
      name: playerData.player.name,
      photo: playerData.player.photo,
    })) || [];

  const topAssisters =
    model.topAssistersPromiseState?.data?.map((playerData) => ({
      id: playerData.player.id,
      name: playerData.player.name,
      photo: playerData.player.photo,
    })) || [];

  return (
    <div className="comparison-page">
      <PlayerComparisonView
        searchContext={model.searchContext}
        onSelectPlayerA={() => handleSelectPlayerCB("A")}
        onSelectPlayerB={() => handleSelectPlayerCB("B")}
        onResetPlayers={handleResetPlayersCB}
        onTextChange={handleCompareTextChangeCB}
        searchResults={searchResults}
        topScorers={topScorers}
        topAssisters={topAssisters}
        onPlayerClick={handleSelectPlayerForComparisonACB}
        playerA={model.playerA}
        playerB={model.playerB}
      />
    </div>
  );
});
