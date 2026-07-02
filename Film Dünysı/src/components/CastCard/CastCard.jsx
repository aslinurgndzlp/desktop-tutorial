import React from 'react';
import { tmdbApi } from '../../services/tmdbApi';

const CastCard = ({ member }) => {
  if (!member) return null;

  const profileUrl = member.profile_path
    ? tmdbApi.getImageUrl(member.profile_path, 'w185')
    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'; // avatar fallback

  return (
    <div className="card h-100 bg-card-custom border-0 overflow-hidden text-center shadow-sm py-3 px-2">
      <div className="mx-auto mb-2 rounded-circle overflow-hidden aspect-ratio-profile" style={{ width: '90px', height: '90px', border: '2px solid rgba(99, 102, 241, 0.2)' }}>
        <img
          src={profileUrl}
          alt={member.name}
          className="w-100 h-100 object-fit-cover"
          loading="lazy"
        />
      </div>
      <div className="card-body p-0">
        <h6 className="card-title text-white small fw-bold mb-1 text-truncate" title={member.name}>
          {member.name}
        </h6>
        <p className="card-text text-muted-custom mb-0 text-truncate" style={{ fontSize: '0.75rem' }} title={member.character}>
          {member.character}
        </p>
      </div>
    </div>
  );
};

export default CastCard;
