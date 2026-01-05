import React from 'react';
import Button from './Button';
import Badge from './Badge';

const FavouritesPanel = ({ favourites, onRemove, onClear, onDrop, onDragOver }) => {
    return (
        <aside
            className="favourites-panel"
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <div className="favourites-header">
                <h3>❤️ Favorites ({favourites.length})</h3>
                {favourites.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={onClear} className="text-red-500 hover:text-red-600">
                        Clear All
                    </Button>
                )}
            </div>

            {favourites.length === 0 ? (
                <div className="favourites-empty">
                    <div className="empty-icon">📂</div>
                    <p>Drag properties here<br />to save them</p>
                </div>
            ) : (
                <div className="favourites-list">
                    {favourites.map((fav) => (
                        <div key={fav.id} className="fav-item">
                            <img src={fav.previewPicture} alt={fav.title} className="fav-img" />
                            <div className="fav-content">
                                <div className="fav-title">{fav.title}</div>
                                <div className="fav-price">
                                    {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(fav.price)}
                                </div>
                            </div>
                            <button
                                className="fav-remove"
                                onClick={() => onRemove(fav.id)}
                                aria-label="Remove from favourites"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </aside>
    );
};

export default FavouritesPanel;
