import React from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';

const Card = ({ property, onFavourite, isFavourite }) => {
    const { id, title, price, type, location, bedrooms, previewPicture, added } = property;
    const formattedPrice = new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        maximumFractionDigits: 0
    }).format(price);

    return (
        <div className="card">
            <div className="card-image-wrapper">
                <Link to={`/property/${id}`}>
                    <img src={previewPicture} alt={title} className="card-image" />
                </Link>
                <div className="card-badges">
                    <Badge variant={type === 'house' ? 'primary' : 'secondary'}>
                        {type.toUpperCase()}
                    </Badge>
                    <Badge variant="accent">{bedrooms} Beds</Badge>
                </div>
                <button
                    className={`favourite-btn ${isFavourite ? 'active' : ''}`}
                    onClick={() => onFavourite(property)}
                    aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
                >
                    {isFavourite ? '♥' : '♡'}
                </button>
            </div>
            <div className="card-content">
                <div className="card-header">
                    <h3 className="card-title">
                        <Link to={`/property/${id}`}>{title}</Link>
                    </h3>
                    <p className="card-price">{formattedPrice}</p>
                </div>
                <p className="card-location">📍 {location}</p>
                <p className="card-date">Added: {added.month} {added.day}, {added.year}</p>
            </div>
        </div>
    );
};

export default Card;
