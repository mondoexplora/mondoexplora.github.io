const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Extract route parameters from the URL path
    const pathSegments = event.path.split('/').filter(segment => segment);
    const routeIndex = pathSegments.indexOf('route');
    const fromLocation = pathSegments[routeIndex + 1];
    const toLocation = pathSegments[routeIndex + 2];

    if (!fromLocation || !toLocation) {
      return {
        statusCode: 404,
        body: 'Route not found'
      };
    }

    // Read the route template
    const templatePath = '/route/index.html';
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

        // Extract origin and destination from URL path
        function getRouteFromPath() {
            const pathSegments = window.location.pathname.split('/').filter(segment => segment);
            
            // Look for 'route' in the path and get the next two segments
            const routeIndex = pathSegments.indexOf('route');
            if (routeIndex !== -1 && pathSegments.length >= routeIndex + 3) {
                return {
                    origin: pathSegments[routeIndex + 1],
                    destination: pathSegments[routeIndex + 2]
                };
            }
            
            // Fallback to query parameters for backward compatibility
            const params = new URLSearchParams(window.location.search);
            return {
                origin: params.get('origin') || '',
                destination: params.get('destination') || ''
            };
        }

        const { origin, destination } = getRouteFromPath();
        
        // Format both origin and destination names for display
        const formattedOrigin = formatDestinationName(origin);
        const formattedDestination = formatDestinationName(destination);

        const destLower = destination.toLowerCase().replace(/ /g, '_');
        const jsonUrl = \`/data/hotels/\${destLower}.json\`;

        // Update meta tags dynamically
        const seoTitle = \`\${formattedOrigin} to \${formattedDestination} | Compare Travel Modes & Hotel deals\`;
        const seoDescription = \`Compare travel modes from \${formattedOrigin} to \${formattedDestination} in ExploraMondo. Discover routes, compare travel modes, and explore luxury hotel promotions in \${formattedDestination}\`;
        const seoKeywords = \`travel routes, flights, trains, buses, hotels, \${formattedOrigin} to \${formattedDestination}, travel comparison\`;
        
        document.title = seoTitle;
        document.querySelector('meta[name="description"]').setAttribute('content', seoDescription);
        document.querySelector('meta[name="keywords"]').setAttribute('content', seoKeywords);
        document.querySelector('meta[property="og:title"]').setAttribute('content', seoTitle);
        document.querySelector('meta[property="og:description"]').setAttribute('content', seoDescription);
        document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);
        document.querySelector('meta[name="twitter:title"]').setAttribute('content', seoTitle);
        document.querySelector('meta[name="twitter:description"]').setAttribute('content', seoDescription);
        document.querySelector('link[rel="canonical"]').setAttribute('href', window.location.href);
        
        // Update breadcrumb
        document.getElementById('breadcrumb-current').textContent = \`\${formattedOrigin} to \${formattedDestination}\`;

        document.getElementById('route-heading').textContent = \`\${formattedOrigin} to \${formattedDestination}\`;
        document.getElementById('route-description').textContent = \`Discover and compare the fastest, cheapest and most convenient travel modes between \${formattedOrigin} and \${formattedDestination}, including flights, trains, buses and ferries.\`;

        // Pre-fill search inputs
        document.getElementById('origin-input').value = formattedOrigin;
        document.getElementById('destination-input').value = formattedDestination;

        document.getElementById('deal-title').textContent = \`Best Hotel Deals in \${formattedDestination}\`;
        document.getElementById('deal-subtitle').textContent = \`Explore top-rated luxury hotel deals and discounts near \${formattedDestination}. Stay in comfort, close to key locations including beaches, hospitals, and city centers.\`;

        // Generate travel mode cards from route-specific data
        function generateTravelModes() {
          const routeKey = \`\${origin.toLowerCase()}_\${destination.toLowerCase()}\`;
          const routeDataUrl = \`/data/routes/\${routeKey}.json\`;
          
          fetch(routeDataUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error('Route data not found');
              }
              return response.json();
            })
            .then(routeData => {
              const container = document.getElementById('travel-modes-container');
              if (!container) return;
              
              container.innerHTML = '';
              
              if (routeData.modes && routeData.modes.length > 0) {
                routeData.modes.forEach(mode => {
                  const card = document.createElement('div');
                  card.className = 'travel-mode-card';
                  card.innerHTML = \`
                    <div class="mode-icon">\${mode.icon || '🚗'}</div>
                    <div class="mode-info">
                      <h3>\${mode.name}</h3>
                      <p class="mode-duration">\${mode.duration}</p>
                      <p class="mode-price">\${mode.price}</p>
                      <p class="mode-description">\${mode.description}</p>
                    </div>
                  \`;
                  container.appendChild(card);
                });
              } else {
                container.innerHTML = '<p>No route data available for this journey.</p>';
              }
            })
            .catch(error => {
              console.warn("Route data fetch error:", error);
              const container = document.getElementById('travel-modes-container');
              if (container) {
                container.innerHTML = '<p>No route data available for this journey.</p>';
              }
            });
        }

        // Load hotels when page loads
        document.addEventListener('DOMContentLoaded', function() {
          generateTravelModes();
          
          fetch(jsonUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error('Hotel data not found');
              }
              return response.json();
            })
            .then(hotels => {
              const container = document.getElementById('hotel-container');
              container.innerHTML = '';
              hotels.slice(0, 4).forEach(hotel => {
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
            })
            .catch(error => {
              console.warn("Hotel fetch error:", error);
              const container = document.getElementById('hotel-container');
              container.innerHTML = '<p>No hotel data available for this destination.</p>';
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
    console.error('Error in route function:', error);
    return {
      statusCode: 500,
      body: 'Internal server error'
    };
  }
}; 