const modifyMedia = (mediaUrls, mediaType, incidentId) => {
    if (mediaUrls && mediaType && incidentId) {
      const media = typeof mediaUrls === 'string' ? [mediaUrls] : mediaUrls;
      const modifiedMedia = media.map(url => ({ 
        url, incidentId, type: mediaType
      }));

      return modifiedMedia;
    }
    return [];
};

module.exports = modifyMedia;
