interface ImageSource {
  searchTitle: string;
  source: string;
  caption: string;
  alt: string;
}

interface WikimediaResponse {
  query?: {
    pages?: {
      [key: string]: {
        imageinfo?: Array<{
          url: string;
          thumburl?: string;  // Add this line
        }>;
      };
    };
  };
}

export async function getImageUrlFromSource({ searchTitle, source, caption, alt }: ImageSource): Promise<string> {
  const sourceType = source.split('=')[1]?.toLowerCase() || '';
  const searchQuery = encodeURIComponent(searchTitle.toLowerCase().trim());

  switch (sourceType) {
    case 'wikipedia': {
      const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${searchQuery}&gsrlimit=1&prop=imageinfo&iiprop=url|size&iiurlwidth=400&maxage=3600&smaxage=3600&format=json&origin=*`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json() as WikimediaResponse;
        
        // Extract the first page's image URL from the response
        const pages = data.query?.pages || {};
        const firstPage = Object.values(pages)[0];
        const imageUrl = firstPage?.imageinfo?.[0]?.thumburl || firstPage?.imageinfo?.[0]?.url;
        
        return imageUrl || '';
      } catch (error) {
        console.error('Error fetching Wikipedia image:', error);
        return '';
      }
    }
      
    case 'pexels':
      return `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=1&size=medium`;
      
    case 'unsplash':
      return `https://api.unsplash.com/photos/random?query=${searchQuery}&orientation=landscape`;
      
    case 'pixabay':
      return `https://pixabay.com/api/?q=${searchQuery}&image_type=photo&per_page=3`;
      
    default:
      return `https://via.placeholder.com/800x600/dddddd/333333?text=${encodeURIComponent(searchTitle)}`;
  }
}