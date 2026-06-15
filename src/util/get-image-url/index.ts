export const getImage = (rawURL: string | undefined, size = 800): string => {
  if (!rawURL) return "/placeholder.png"; // never return "" — next/image crashes on empty

  if (rawURL.startsWith("http://") || rawURL.startsWith("https://")) {
    // Google Drive
    if (rawURL.includes("drive.google.com")) {
      const match = rawURL.match(/\/d\/(.+?)\//);
      const imageId = match ? match[1] : null;
      if (imageId) return `https://drive.google.com/thumbnail?id=${imageId}&sz=w${size}-h${size}`;
    }
    return rawURL;
  }

  if (rawURL.startsWith("/")) return rawURL; // already a valid relative path

  // relative path like "laptops/..." or "offers/..."
  return `https://api.spacenetstore.com/media/${rawURL}`;
};