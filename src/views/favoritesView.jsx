import { IoFootballSharp } from "react-icons/io5";
import { FaTshirt, FaTrashAlt } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";

export function FavoritesView({ favorites, removeFromFavorites, onPlayerClick }) {

    // Navigate back to search page
    function backToSearchACB() {
        window.location.hash = "#/search";
    }

    // Navigate back to details page
    function backToDetailsACB() {
        window.location.hash = "#/details";
    }


    // If no favorites, show the empty message
    if (!favorites.length) {
        return (
            <div className="favorites-container empty">
                <h1>
                    <IoFootballSharp>No favorites added</IoFootballSharp>
                </h1>
                <p className="empty-message">You haven’t added any players to your favorites yet!</p>
                <button className="back-to-search-button" onClick={backToSearchACB}>
                    <MdArrowBack /> Back to Search
                </button>
            </div>
        );
    }

    return (
        <div className="favorites-container">
            <h1 className="title">
                <IoFootballSharp>Your favorite players</IoFootballSharp>
            </h1>

            <div className="players-grid">
                {favorites.map(player => (
                    // Ensure each player has a unique "key" prop
                    player.id ? (
                        <div 
                        key={player.id} 
                        className="player-card"
                        onClick={() => {
                            onPlayerClick(player);
                            backToDetailsACB();
                        }}
                        >
                            <img src={player.photo} alt={player.name} className="player-photo" />

                            <h2 className="player-name">
                                <FaTshirt /> {player.name}
                            </h2>
                            <div className="actions">
                                <button className="remove-button" 
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    removeFromFavorites(player.id)}}>
                                    <FaTrashAlt /> Remove
                                </button>
                            </div>
                        </div>
                    ) : null // Don't render player if there's no valid "id"
                ))}
            </div>
        </div>
    );
}