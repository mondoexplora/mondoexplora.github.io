const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Extract destination name from the URL path
    const pathSegments = event.path.split('/').filter(segment => segment);
    const destinationIndex = pathSegments.indexOf('destination');
    const destinationName = pathSegments[destinationIndex + 1];

    if (!destinationName) {
      return {
        statusCode: 404,
        body: 'Destination not found'
      };
    }

    // Read the destination template
    const templatePath = path.join(__dirname, '../../destination/index.html');
    let htmlContent;
    try {
      htmlContent = fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
      console.error('Error loading template:', error);
      return {
        statusCode: 500,
        body: 'Template not found'
      };
    }

    // Create the JavaScript replacement (same as Flask version)
    const scriptReplacement = `
    <script>
        // Function to format destination name (replace underscores and hyphens with spaces and capitalize properly)
        function formatDestinationName(dest) {
            return dest.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
        }

        // Extract destination from URL path
        function getDestinationFromPath() {
            const pathSegments = window.location.pathname.split('/').filter(segment => segment);
            const destinationIndex = pathSegments.indexOf('destination');
            if (destinationIndex !== -1 && pathSegments.length >= destinationIndex + 2) {
                return pathSegments[destinationIndex + 1];
            }
            return '';
        }

        const destination = getDestinationFromPath();
        const formattedDestination = formatDestinationName(destination);
        const destLower = destination.toLowerCase().replace(/ /g, '_');
        const jsonUrl = \`/data/hotels/\${destLower}.json\`;

        // Update meta tags dynamically
        const seoTitle = \`Best Hotel Deals in \${formattedDestination} | Luxury Hotels & Resorts | ExploraMondo\`;
        const seoDescription = \`Find the best hotel deals in \${formattedDestination}. Compare prices, read reviews, and book luxury hotels with exclusive discounts. Best rates guaranteed.\`;
        const seoKeywords = \`hotels in \${formattedDestination}, \${formattedDestination} hotel deals, luxury hotels \${formattedDestination}, best hotels \${formattedDestination}, hotel booking \${formattedDestination}\`;
        
        document.title = seoTitle;
        document.querySelector('meta[name="description"]').setAttribute('content', seoDescription);
        document.querySelector('meta[name="keywords"]').setAttribute('content', seoKeywords);
        document.querySelector('meta[property="og:title"]').setAttribute('content', seoTitle);
        document.querySelector('meta[property="og:description"]').setAttribute('content', seoDescription);
        document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);
        document.querySelector('meta[name="twitter:title"]').setAttribute('content', seoTitle);
        document.querySelector('meta[name="twitter:description"]').setAttribute('content', seoDescription);
        document.querySelector('link[rel="canonical"]').setAttribute('href', window.location.href);

        // Update page content safely
        const titleElement = document.getElementById('destination-title');
        const descriptionElement = document.getElementById('destination-description');
        
        if (titleElement) titleElement.textContent = \`Best Hotel Deals in \${formattedDestination}\`;
        if (descriptionElement) descriptionElement.textContent = \`Discover amazing hotel deals and luxury accommodations in \${formattedDestination}. Book with confidence and enjoy exclusive discounts.\`;

        // Global variables and functions
        let allHotels = [];
        
        function sortHotels(sortType) {
          if (!allHotels || !allHotels.length) return;
          
          let sortedHotels = [...allHotels];
          
          switch(sortType) {
            case 'price-low':
              sortedHotels.sort((a, b) => a.price - b.price);
              break;
            case 'price-high':
              sortedHotels.sort((a, b) => b.price - a.price);
              break;
            case 'name':
              sortedHotels.sort((a, b) => a.vendor_name.localeCompare(b.vendor_name));
              break;
            default:
              return;
          }
          
          displayHotels(sortedHotels);
        }
        
        function displayHotels(hotels) {
          const container = document.getElementById('hotel-container');
          if (!container) return;
          
          container.innerHTML = '';
          
          hotels.forEach(hotel => {
            const card = document.createElement('div');
            card.className = 'hotel-card';
            card.innerHTML = \`
              <div class="hotel-image-container">
                <img src="\${hotel.hero_image}" alt="\${hotel.vendor_name}" />
                <div class="hotel-price"><del>$\${hotel.value}</del> $\${hotel.price}</div>
              </div>
              <div class="hotel-card-content">
                <h4>\${hotel.vendor_name}</h4>
                <div class="hotel-location">\${hotel.location_heading}, \${hotel.location_subheading}</div>
                <p>\${hotel.title.length > 100 ? hotel.title.substring(0, 100) + '...' : hotel.title}</p>
                <a href="\${hotel.link}" target="_blank" class="view-deal-btn">View Deal</a>
              </div>\`;
            container.appendChild(card);
          });
        }

        // Load hotels when page loads
        document.addEventListener('DOMContentLoaded', function() {
          fetch(jsonUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error('Hotel data not found');
              }
              return response.json();
            })
            .then(hotels => {
              allHotels = hotels;
              displayHotels(hotels);
            })
            .catch(error => {
              console.error("Hotel fetch error:", error);
              const container = document.getElementById('hotel-container');
              if (container) {
                container.innerHTML = \`<p>No hotel data available for this destination. Error: \${error.message}</p>\`;
              }
            });
        });
    </script>
    `;

    // Find and replace the entire script section
    const startScript = htmlContent.indexOf('<script>');
    const endScript = htmlContent.indexOf('</script>', startScript);
    
    if (startScript !== -1 && endScript !== -1) {
      // Replace the entire script section
      htmlContent = htmlContent.substring(0, startScript) + scriptReplacement + htmlContent.substring(endScript + 9);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600'
      },
      body: htmlContent
    };

  } catch (error) {
    console.error('Error in destination function:', error);
    return {
      statusCode: 500,
      body: 'Internal server error'
    };
  }
}; 