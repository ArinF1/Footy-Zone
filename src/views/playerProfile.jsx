import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFutbol,
    faCalendarAlt,
    faWeight,
    faRulerVertical,
    faGlobe,
    faUser,
    faBullseye,
    faArrowsAlt,
    faHandsHelping,
    faRunning,
    faShieldAlt,
    faShieldAlt as faDuels,
    faFlag
} from '@fortawesome/free-solid-svg-icons';

export default function PlayerProfile({ player, totalStats, }) {
    if (!player || !totalStats) {
        return <div>No data available for this player.</div>;
    }

    return (
        <div className="details-view">
            <div className="player-header">
                {/* Display player's photo */}
                <img className="player-photo" src={player.photo} alt={player.name} />
                <h2 className="player-name">{player.name}</h2>
            </div>
            <div className="personal-info">
                <p><FontAwesomeIcon icon={faCalendarAlt} /><strong>Age:</strong> {player.age}</p>
                <p><FontAwesomeIcon icon={faUser} /><strong>Firstname:</strong> {player.firstname}</p>
                <p><FontAwesomeIcon icon={faUser} /><strong>Lastname:</strong> {player.lastname}</p>

                <p><FontAwesomeIcon icon={faCalendarAlt} /><strong>Team:</strong> {totalStats.team} <img src={totalStats.logo} alt="Team Logo" style={{ width: "50px", height: "auto" }} /></p>



                <p><FontAwesomeIcon icon={faCalendarAlt} /><strong>Birthdate:</strong> {player.birth.date}</p>
                <p><FontAwesomeIcon icon={faGlobe} /><strong>Birthplace:</strong> {player.birth.place}, {player.birth.country}</p>
                <p><FontAwesomeIcon icon={faGlobe} /><strong>Nationality:</strong> {player.nationality}</p>

                <p><FontAwesomeIcon icon={faArrowsAlt} /><strong>Position:</strong> {totalStats.position}</p>
                <p><FontAwesomeIcon icon={faRulerVertical} /> <strong>Height:</strong> {player.height}</p>
                <p><FontAwesomeIcon icon={faWeight} /><strong>Weight:</strong> {player.weight}</p>
            </div>
            <div className="statistics">
                <div className="stat-item" >
                    <FontAwesomeIcon icon={faFutbol} className="stat-icon" />
                    <p><strong>Goals:</strong> {totalStats.goals}</p>
                </div>
                <div className="stat-item" >
                    <FontAwesomeIcon icon={faHandsHelping} className="stat-icon" />
                    <p><strong>Assists:</strong> {totalStats.assists}</p>
                </div>
                <div className="stat-item" >
                    <FontAwesomeIcon icon={faCalendarAlt} className="stat-icon" />
                    <p><strong>Average Rating:</strong> {totalStats.avgRating.toFixed(2)}</p>
                </div>
                <div className="stat-item" >
                    <FontAwesomeIcon icon={faBullseye} className="stat-icon" />
                    <p><strong>Shots:</strong> {totalStats.shots}</p>
                </div>
                <div className="stat-item" >
                    <FontAwesomeIcon icon={faCalendarAlt} className="stat-icon" />
                    <p><strong>Appearances:</strong> {totalStats.appearances}</p>
                </div>
                <div className="stat-item" >
                    <FontAwesomeIcon icon={faHandsHelping} className="stat-icon" />
                    <p><strong>Passes:</strong> {totalStats.passes}</p>
                </div>
                <div className="stat-item">
                    <FontAwesomeIcon icon={faRunning} className="stat-icon" />
                    <p><strong>Dribbles:</strong> {totalStats.dribbleAttempts}</p>
                    <p><strong>Success Rate:</strong> {(totalStats.dribbleSuccess / totalStats.dribbleAttempts * 100 || 0).toFixed(0)} %</p>
                </div>
                <div className="stat-item" >
                    <FontAwesomeIcon icon={faShieldAlt} className="stat-icon" />
                    <p><strong>Tackles:</strong> {totalStats.tackles}</p>
                </div>
                {/* Additional Stats */}
                <div className="stat-item" >
                    <FontAwesomeIcon icon={faShieldAlt} className="stat-icon" />
                    <p><strong>Duels (Total/Won):</strong> {totalStats.duelsTotal} / {totalStats.duelsWon}</p>
                </div>
                <div className="stat-item" >
                    <FontAwesomeIcon icon={faFlag} className="stat-icon" />
                    <p><strong>Cards (Yellow/Red):</strong> {totalStats.cardsYellow} / {totalStats.cardsRed + totalStats.cardsYellowRed}</p>
                </div>
                <div className="stat-item" >
                    <FontAwesomeIcon icon={faHandsHelping} className="stat-icon" />
                    <p><strong>Fouls (Committed/Drawn):</strong> {totalStats.foulsCommitted} / {totalStats.foulsDrawn}</p>
                </div>
                <div className="stat-item" >
                    <FontAwesomeIcon icon={faCalendarAlt} className="stat-icon" />
                    <p><strong>Minutes Played:</strong> {totalStats.minutes}</p>
                </div>
            </div>
        </div>
    );
}
