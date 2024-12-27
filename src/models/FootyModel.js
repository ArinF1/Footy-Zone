import { makeAutoObservable } from "mobx";
import { searchPlayer, getPlayerStats, getTopScorers, getTopAssisters, getLeagues } from "/src/footySource.js";
import { resolvePromise } from "/src/resolvePromise.js"

const model = {
  ready: false,
  user: undefined,

  compareSearchResultsPromiseState: { data: null, loading: false, error: null },
  playerA: null,
  playerB: null,
  playerAStatsPromiseState: { data: null, loading: false, error: null },
  playerBStatsPromiseState: { data: null, loading: false, error: null },
  currentSeason: 2023,

  searchParam: {},
  searchResultsPromiseState: { data: null, loading: false, error: null },
  searchContext: null,

  currentPlayerPromiseState: { data: null, loading: false, error: null },
  currentPlayerId: null,

  teamsPromiseState: { data: null, loading: false, error: null },
  leaguesPromiseState: { data: null, loading: false, error: null },
  selectedLeagueId: null,
  
  currentFavoritePlayerId: null,
  currentFavoritePlayerPromiseState: { data: null, loading: false, error: null },
  favorites: [],

  topScorersPromiseState: { data: null, loading: false, error: null },
  topAssistersPromiseState: { data: null, loading: false, error: null },
  selectedLeagueId: null,
  favorites: [],
  compareSearchParam: {}, // Nytt för jämförelsevyn
  compareSearchResultsPromiseState: { data: null, loading: false, error: null },
  searchContext: null,
  navBarSearchParam: {},
  navBarSearchResultsPromiseState: { data: null, loading: false, error: null },


  initialize() {
    makeAutoObservable(this);
    this.ready = true;
  },

  setSearchParam(param) {
    this.searchParam = { ...this.searchParam, ...param };
  },

  setNavBarSearchParam(param) {
    this.navBarSearchParam = { ...this.navBarSearchParam, ...param };
  },
  

  async doNavBarSearch() {
    if (!this.navBarSearchParam.text) return;
  
    const searchPromise = searchPlayer(this.navBarSearchParam.text);
    resolvePromise(searchPromise, this.navBarSearchResultsPromiseState);
  
    try {
      const data = await searchPromise;
  
      if (!Array.isArray(data.response)) {
        throw new Error("Invalid API response structure");
      }
      const filteredPlayers = data.response.filter((playerObj) => {
        const player = playerObj.player;
  
        const requiredKeys = ["age", "birth.place", "height", "weight", "photo", "position"];
  
        const getNestedValue = (obj, keyPath) =>
          keyPath.split(".").reduce((value, key) => value && value[key], obj);
  
        return requiredKeys.every((key) => getNestedValue(player, key) !== null);
      });
  
      this.navBarSearchResultsPromiseState.data = { response: filteredPlayers };
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.navBarSearchResultsPromiseState.loading = false;
    }
  },

  clearNavBarSearchResults() {
    this.navBarSearchResultsPromiseState.data = null;
    this.navBarSearchResultsPromiseState.loading = false;
    this.navBarSearchResultsPromiseState.error = null;
  },

  async doSearch() {
    if (!this.searchParam.text) return;
  
    const searchPromise = searchPlayer(this.searchParam.text);
    resolvePromise(searchPromise, this.searchResultsPromiseState);
  
    try {
      const data = await searchPromise;
  
      if (!Array.isArray(data.response)) {
        throw new Error("Invalid API response structure");
      }

      const filteredPlayers = data.response.filter((playerObj) => {
        const player = playerObj.player;
  
        const requiredKeys = ["age", "birth.place", "height", "weight", "photo", "position"];
  
        const getNestedValue = (obj, keyPath) =>
          keyPath.split(".").reduce((value, key) => value && value[key], obj);
  
        return requiredKeys.every((key) => getNestedValue(player, key) !== null);
      });

      this.searchResultsPromiseState.data = { response: filteredPlayers };

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.searchResultsPromiseState.loading = false;
    }
  },

  setCompareSearchParam(param) {
    this.compareSearchParam = { ...this.compareSearchParam, ...param };
  },

  async doCompareSearch() {
    if (!this.compareSearchParam.text) return;

    const searchPromise = searchPlayer(this.compareSearchParam.text);
    resolvePromise(searchPromise, this.compareSearchResultsPromiseState);

    try {
      const data = await searchPromise;
      const filteredPlayers = data.response.filter((playerObj) => {
        const player = playerObj.player;
        const requiredKeys = ["age", "birth.place", "height", "weight", "photo", "position"];
        const getNestedValue = (obj, keyPath) =>
          keyPath.split(".").reduce((value, key) => value && value[key], obj);
        return requiredKeys.every((key) => getNestedValue(player, key) !== null);
      });
      this.compareSearchResultsPromiseState.data = { response: filteredPlayers };
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.compareSearchResultsPromiseState.loading = false;
    }
  },
  

  setCurrentPlayerId(playerId) {
    console.log("Setting current player ID to:", playerId);
    this.currentPlayerId = playerId;

    const season = this.searchParam.season;
    this.getPlayerStats(playerId, season);

    if (!season) {
      this.getPlayerStats(playerId, this.currentSeason);
    } 
  },

  clearSearchResults() {
    const resetPromiseState = (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    };
  
    resetPromiseState(this.searchResultsPromiseState);
    resetPromiseState(this.compareSearchResultsPromiseState);
  },

  setSearchContext(context) {
    this.searchContext = context;
  },

  setPlayerA(player) {
    this.playerA = player;
    console.log("Player A selected:", player);
  },

  setPlayerB(player) {
    this.playerB = player;
    console.log("Player B selected:", player);
  },

  setUser(user) {
    this.user = user;
  },

  clearUserData() {
    this.user = null;
    this.favorites = [];
    this.currentPlayerId = null;
    console.log("Cleared user data.");
  },

  async getPlayerStats(playerId, season, context = null) {
    console.log("Fetching stats for playerId:", playerId, "and season:", season);
    if(!season){
      season = this.currentSeason;
    } 

    try {
      const data = await getPlayerStats(playerId, season);
      console.log("Fetched player stats:", data);

      if (context === "A") {
        this.playerAStatsPromiseState.data = data.statistics;
      } else if (context === "B") {
        this.playerBStatsPromiseState.data = data.statistics;
      } else {
        this.currentPlayerPromiseState.data = data;
      }

      return data;
    } catch (error) {
      console.error("Error fetching player stats:", error);

      if (context === "A") {
        this.playerAStatsPromiseState.error = error;
      } else if (context === "B") {
        this.playerBStatsPromiseState.error = error;
      } else {
        this.currentPlayerPromiseState.error = error;
      }

      throw error;
    }
  },

  async fetchLeagues(season) {
    console.log("Fetching leagues for season:", season);
    const leaguesPromise = getLeagues(season);
    resolvePromise(leaguesPromise, this.leaguesPromiseState);

    try {
      const data = await leaguesPromise; 
      this.leaguesPromiseState.data = data;
      console.log("Fetched leagues:", data);
    } catch (error) {
      console.error("Error fetching leagues:", error);
    } finally {
      this.leaguesPromiseState.loading = false;
    }
  },

  addToFavorites(player) {
    if (!this.favorites.some((fav) => fav.id === player.id)) {
      this.favorites.push(player);
      console.log(`${player.name} added to favorites`);
      return true;
    } else {
      console.warn(`${player.name} is already in favorites`);
      return false;
    }
  },

  removeFromFavorites(playerId) {
    this.favorites = this.favorites.filter((fav) => fav.id !== playerId);
    console.log(`Player with ID ${playerId} removed from favorites`);
  },

  async fetchTopScorers(leagueId, season) {
    console.log("Fetching top scorers for league:", leagueId, "and season:", season);

    const topScorersPromise = getTopScorers(leagueId, season);
    resolvePromise(topScorersPromise, this.topScorersPromiseState);

    try {
      const data = await topScorersPromise;
      console.log("Fetched top scorers:", data);

      this.topScorersPromiseState.data = data;
    } catch (error) {
      console.error("Error fetching top scorers:", error);
    } finally {
      this.topScorersPromiseState.loading = false;
    }
  },

  async fetchTopAssisters(leagueId, season) {
    console.log(`Fetching top assisters for league:`, leagueId, "and season:", season);
    
    const topAssistersPromise = getTopAssisters(leagueId, season);
    resolvePromise(topAssistersPromise, this.topAssistersPromiseState);

    try {
      const data = await topAssistersPromise;
      console.log("Fetched top assisters:", data);
      this.topAssistersPromiseState.data = data;
    } catch (error) {
      console.error("Error fetching top assisters:", error);
    } finally {
      this.topAssistersPromiseState.loading = false;
    }
  },

  notificationState: {
    message: "",
    isVisible: false,
    type: "",
    action: null,       
    actionLabel: "",  
  },

  showNotification(message, type = "success", action = null, actionLabel = "") {
    this.notificationState = { message, isVisible: true, type, action, actionLabel };

    setTimeout(() => {
      this.hideNotification();
    }, 5000);     // Auto-hide after 5 seconds
  },

  hideNotification() {
    this.notificationState = { message: "", isVisible: false, type: "", action: null, actionLabel: "" };
  }, 
};

model.initialize = function () {
  makeAutoObservable(this);
  this.ready = true; 
};

export { model };
