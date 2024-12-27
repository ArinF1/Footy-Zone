import { PROXY_URL, PROXY_KEY } from "/src/apiConfig.js";

// Utility function to process JSON responses
export function getJsonACB(resp) {
  if (resp.status !== 200) {
    throw new Error(`Error fetching data: ${resp.statusText}`);
  }
  return resp.json();
}

// Fetch player profiles by player name
export async function searchPlayer(playerName) {
  const endpoint = "/players/profiles?search=";
  try {
    const url = `${PROXY_URL}${endpoint}${encodeURIComponent(playerName)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": PROXY_URL,
        "x-rapidapi-key": PROXY_KEY,
      },
    });
    return getJsonACB(response); // Process and return JSON response
  } catch (error) {
    console.error("Error fetching player profiles:", error);
    throw error;
  }
}

export async function getPlayerStats(playerId, season) {
  const endpoint = `/players?id=${playerId}&season=${season}`; // Use the dynamic season
  try {
    const url = `${PROXY_URL}${endpoint}`;
    console.log(
      "Fetching player stats for playerId:",
      playerId,
      "and season:",
      season
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": PROXY_URL,
        "x-rapidapi-key": PROXY_KEY,
      },
    });

    const data = await response.json(); // Ensure correct parsing
    console.log("Player stats API response:", data);

    if (data.response && data.response.length > 0) {
      const playerStats = data.response[0];
      const { player, statistics } = playerStats;

      if (statistics && statistics.length > 0) {
        const totalStats = statistics.reduce(
          (acc, stat) => {

            // Team and Logo
            acc.team = stat.team.name;
            acc.logo = stat.team.logo;

            // Position
            acc.position = stat.games.position;
            
            // Goals
            acc.goals += (stat.goals.total) || 0;
            
            // Assists
            acc.assists += stat.goals.assists || 0;

            // Appearances
            acc.appearances += stat.games.appearences || 0;

            // Shots
            acc.shots += stat.shots.total || 0;

            // Passes
            acc.passes += stat.passes.total || 0;

            // Dribbles
            acc.dribbleAttempts += stat.dribbles.attempts || 0;
            acc.dribbleSuccess += stat.dribbles.success || 0;

            // Tackles
            acc.tackles += stat.tackles.total || 0;

            // Average Rating
            acc.avgRating =
              statistics.reduce(
                (acc, stat) => acc + (stat.games.rating ? parseFloat(stat.games.rating) : 0),
                0
              ) / statistics.filter(stat => stat.games.rating !== null).length;


            // Cards
            acc.cardsRed += stat.cards.red || 0;
            acc.cardsYellow += stat.cards.yellow || 0;
            acc.cardsYellowRed += stat.cards.yellowRed || 0;

            // Duels
            acc.duelsTotal += stat.duels.total || 0;
            acc.duelsWon += stat.duels.won || 0;

            // Fouls
            acc.foulsCommitted += stat.fouls.committed || 0;
            acc.foulsDrawn += stat.fouls.drawn || 0;

            // Minutes
            acc.minutes += stat.games.minutes || 0;

            return acc;
          },
          {
            goals: 0,
            assists: 0,
            name: 0,
            logo: 0,
            appearances: 0,
            shots: 0,
            passes: 0,
            dribbleAttempts: 0,
            tackles: 0,
            dribbleSuccess: 0,
            avgRating: 0,
            cardsRed: 0,
            cardsYellow: 0,
            cardsYellowRed: 0,
            duelsTotal: 0,
            duelsWon: 0,
            foulsCommitted: 0,
            foulsDrawn: 0,
            minutes: 0,
          }
        );

        return { player, statistics: totalStats };
      } else {
        console.warn("No valid statistics found for this player.");
        return null;
      }
    } else {
      console.warn("No player data found for the given player ID.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching player stats:", error);
    throw error;
  }
}

// Fetch the top scorers for a specific league and season
export async function getTopScorers(leagueId, season) {
  if (!leagueId) {
    console.error("League ID is not provided.");
    return [];
  }
  
  console.log("Fetching top scorers for league:", leagueId, "and season:", season);  // Debug log

  const endpoint = `/players/topscorers?league=${leagueId}&season=${season}`;
  try {
    const url = `${PROXY_URL}${endpoint}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": PROXY_URL,
        "x-rapidapi-key": PROXY_KEY,
      },
    });

    const data = await getJsonACB(response); // Process JSON response
    console.log("Top scorers API response:", data);  // Log the response

    if (data.response && data.response.length > 0) {
      return data.response; // Return the list of top scorers
    } else {
      console.warn("No top scorers data found for the given league and season.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching top scorers:", error);
    throw error;
  }
}

// Fetch top assisters for a specific league and season
export async function getTopAssisters(leagueId, season) {
  if (!leagueId) {
    console.error("League ID is not provided.");
    return [];
  }

  const endpoint = `/players/topassists?league=${leagueId}&season=${season}`;
  try {
    const url = `${PROXY_URL}${endpoint}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": PROXY_URL,
        "x-rapidapi-key": PROXY_KEY,
      },
    });

    const data = await getJsonACB(response); // Process JSON response
    console.log("Top Assists API response:", data); // Log the response

    if (data.response && data.response.length > 0) {
      return data.response; // Return the list of players
    } else {
      console.warn("No top assisters data found for the given league and season.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching top assisters:", error);
    throw error;
  }
}

// Fetch leagues
export async function getLeagues(season) {
  const leagueMapping = {
    "Premier League": 39,
    "La Liga": 140,
    "Bundesliga": 78,
    "Serie A": 135,
    "Ligue 1": 61,
  };
  
  const topLeagueIds = Object.values(leagueMapping);  // Get the league IDs (e.g., 39, 140, 78, 135, 61)
  const endpoint = `/leagues?season=${season}`;

  try {
    const url = `${PROXY_URL}${endpoint}`;
    console.log("Fetching leagues for season:", season);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": PROXY_URL,
        "x-rapidapi-key": PROXY_KEY,
      },
    });

    const data = await getJsonACB(response); // Process JSON response
    console.log("Leagues API response:", data);

    if (data.response && data.response.length > 0) {
      // Filter the leagues based on the IDs from the mapping
      const filteredLeagues = data.response.filter(league =>
        topLeagueIds.includes(league.league.id)
      );

      console.log("Filtered top 5 leagues:", filteredLeagues);
      return filteredLeagues; // Return only the top 5 leagues
    } else {
      console.warn("No league data found for the given season.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching leagues:", error);
    throw error;
  }
}


export async function getTeams() {
  const endpoint = "/teams?name=";
  try {
    const url = `${PROXY_URL}${endpoint}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": PROXY_URL,
        "x-rapidapi-key": PROXY_KEY,
      },
    });
    return getJsonACB(response); // Process and return JSON response
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
}

// Fetch available countries
export async function getCountries() {
  const endpoint = "/countries"; 
  try {
    const url = `${PROXY_URL}${endpoint}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": PROXY_URL,
        "x-rapidapi-key": PROXY_KEY,
      },
    });
    return getJsonACB(response); // Process and return JSON response
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
}

// Utility function to safely get the first object from an array
export function arrayObjACB(arr) {
  return arr.length > 0 ? arr[0] : undefined;
}

// Fetch player details (similar to searchPlayer but kept separate for future extensibility)
export async function getPlayerDetails(playerName) {
  return searchPlayer(playerName);
}
