import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { SearchFormView } from "/src/views/searchFormView";
import { SearchResultsView } from "/src/views/searchResultsView";
import { handleSignOut } from "../models/firebaseModel";
import loadingscreen from "/src/images/loadingscreen.png";

export const Search = observer(function Search({ model }) {
  const [searchText, setSearchText] = useState(model.searchParam.text || "");
  const [selectedLeague, setSelectedLeague] = useState("Premier League");
  const [season, setSeason] = useState(2024);
  const [showTopScorers, setShowTopScorers] = useState(false);
  const [showTopAssisters, setShowTopAssisters] = useState(false);

  const leagueMapping = {
    "Premier League": 39,
    "La Liga": 140,
    "Bundesliga": 78,
    "Serie A": 135,
    "Ligue 1": 61,
  };

  useEffect(() => {
    const defaultLeagueId = leagueMapping["Premier League"];
    setSelectedLeague("Premier League");
    setSeason(2024);
    setShowTopScorers(true);
    model.fetchTopScorers(defaultLeagueId, 2024);
    model.fetchTopAssisters(defaultLeagueId, 2024);
  }, []); // Runs only once on component mount

  // Re-trigger the search when selectedLeague or season changes
  useEffect(() => {
    if (selectedLeague && leagueMapping[selectedLeague]) {
      model.setSearchParam(leagueMapping[selectedLeague], season); // Pass league ID to doSearch
      model.doSearch();
    }
  }, [selectedLeague, season, model]); // When league or season changes, re-run the search

  const handleTextChange = (value) => {
    setSearchText(value);
    model.setSearchParam({ text: value, league: selectedLeague, season });
  };

  const handleLeagueChange = (e) => {
    const leagueName = e.target.value;
    const leagueId = leagueMapping[leagueName] || null;
    setSelectedLeague(leagueName); // Update selectedLeague to the league name
    if (leagueId) {
      model.fetchTopScorers(leagueId, season); // Fetch top scorers using the league ID
      model.fetchTopAssisters(leagueId, season); // Fetch top assisters using the league ID
    }
  };

  const handleSeasonChange = (e) => {
    const newSeason = e.target.value;
    setSeason(newSeason); // Update the season
    model.fetchTopScorers(leagueMapping[selectedLeague], newSeason); // Fetch top scorers for the selected league and new season
    model.fetchTopAssisters(leagueMapping[selectedLeague], newSeason); // Fetch top assisters for the selected league and new season
  };

  const handleSearchSubmit = () => {
    model.setSearchParam({ text: searchText, league: selectedLeague, season });
    model.doSearch(leagueMapping[selectedLeague], season);
    model.clearSearchResults();
  };

  const handleSelectPlayerForHomepage = async (player) => {
    model.setCurrentPlayerId(player.id);
    await model.getPlayerStats(player.id, season);
    setSearchText("");
    window.location.hash = "#/details";
  };

  const handleSearchText = (text) => {
    model.setSearchParam({ text });
    if (text.length > 2) {
      model.doSearch();
    } else {
      model.clearSearchResults();
    }
  };

  const handleToggleTopScorers = () => {
    setShowTopScorers((prev) => !prev);
  };

  const handleToggleTopAssisters = () => {
    setShowTopAssisters((prev) => !prev);
  };

  const searchResults = model.searchResultsPromiseState?.data?.response || [];
  const topScorers = model.topScorersPromiseState?.data || [];
  const topAssisters = model.topAssistersPromiseState?.data || [];

  return (
    <div>
      <SearchFormView
        showSearchBar={true}
        text={searchText}
        selectedLeague={selectedLeague}
        season={season}
        onTextChange={handleTextChange}
        onSearch={handleSearchText}
        onSearchSubmit={handleSearchSubmit}
        onLeagueChange={handleLeagueChange}
        onSeasonChange={handleSeasonChange}
        onPlayerClick={handleSelectPlayerForHomepage}
        onLogout={handleSignOut}
        onToggleTopScorers={handleToggleTopScorers}
        onToggleTopAssisters={handleToggleTopAssisters}
      />

      <div>
        {model.searchResultsPromiseState?.loading && (
          <div className="loading-search">
            <img src={loadingscreen} alt="Loading..." />
          </div>
        )}

        {model.searchResultsPromiseState?.error && <p>Error fetching data</p>}

        {searchResults.length > 0 && (
          <div>
            <h2>Search Results</h2>
            <SearchResultsView
              searchResults={searchResults.map((player) => ({
                id: player.player.id,
                name: player.player.name,
                photo: player.player.photo,
              }))}
              onPlayerClick={handleSelectPlayerForHomepage}
            />
          </div>
        )}

        {showTopScorers && topScorers.length > 0 && (
          <div>
            <h2>Top Scorers</h2>
            <SearchResultsView
              searchResults={topScorers.map((player) => ({
                id: player.player.id,
                name: player.player.name,
                photo: player.player.photo,
              }))}
              onPlayerClick={handleSelectPlayerForHomepage}
            />
          </div>
        )}

        {showTopAssisters && topAssisters.length > 0 && (
          <div>
            <h2>Top Assisters</h2>
            <SearchResultsView
              searchResults={topAssisters.map((player) => ({
                id: player.player.id,
                name: player.player.name,
                photo: player.player.photo,
              }))}
              onPlayerClick={handleSelectPlayerForHomepage}
            />
          </div>
        )}
      </div>
    </div>
  );
});
