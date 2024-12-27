import { observer } from "mobx-react-lite";
import { FavoritesView } from "../views/favoritesView";

export const Favorites = observer(function Favorites({ model }) {

  const handleSelectPlayerForHomepage = async (player) => {
    model.setCurrentPlayerId(player.id);
    await model.getPlayerStats(player.id);

    // Clear search results and reset the search bar
    if (model.searchResultsPromiseState.data) {
      model.searchResultsPromiseState.data.response = [];
    }
  
  };
  
  return (
    <FavoritesView
      favorites={model.favorites}
      removeFromFavorites={model.removeFromFavorites.bind(model)}
      onPlayerClick={handleSelectPlayerForHomepage}
    />
  );
});
