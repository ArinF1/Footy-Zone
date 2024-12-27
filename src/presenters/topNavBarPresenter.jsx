import { observer } from "mobx-react-lite";
import { TopNavBarView } from "../views/topNavBar";
import { handleSignOut } from "../models/firebaseModel";

export const TopNavBar = observer(function TopNavBar({ model, currentRoute }) { 
  const isAnonymous = model.user?.isAnonymous || false; 

  function handleNavBarSearch(text) {
  model.setNavBarSearchParam({ text });

  if (text.length > 2) {
    model.doNavBarSearch();
  } else {
    model.clearNavBarSearchResults();
  }
}

  function handlePlayerClick(player) {
    // Set the current player ID as before
    model.setCurrentPlayerId(player.player.id);
    // Navigate to the player details page
    window.location.hash = "#/details";

    // Clear search results and reset the search bar
    model.clearNavBarSearchResults();
  }

  const searchResults = model.navBarSearchResultsPromiseState?.data?.response || [];  // Default to empty array if not available
  const hideExtraButtons = currentRoute === "/" || currentRoute === "/search";

  return (
    <TopNavBarView 
      onSearch={handleNavBarSearch} 
      searchResults={searchResults}
      onPlayerClick={handlePlayerClick}
      onLogout={handleSignOut}
      isAnonymous={isAnonymous} 
      showExtraButtons={!hideExtraButtons}
    />
  );
});
