export const getImage = (rawURL: string | undefined, size = 800): string => {
  if (!rawURL) return "";

  // Check if it's a Google Drive link
  const isGoogleDrive = rawURL.includes("drive.google.com");
  if (isGoogleDrive) {
    const match = rawURL.match(/\/d\/(.+?)\//);
    const imageId = match ? match[1] : null;

    if (imageId) {
      return `https://drive.google.com/thumbnail?id=${imageId}&sz=w${size}-h${size}`;
    }

    return rawURL; 
  }

  
  const containsProducts = rawURL.includes("products/");
  if (containsProducts) {
    return `https://dockergqlserver.onrender.com/media/${rawURL}`;
  }
  const containsOffers= rawURL.includes("offers/");
  if (containsOffers) {
    return `https://dockergqlserver.onrender.com/media/${rawURL}`;
  }

 
  return rawURL;
};
