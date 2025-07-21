#!/usr/bin/env python3
from flask import Flask, render_template_string, send_from_directory, request, redirect, url_for
import os
import json

app = Flask(__name__)

# Serve static files
@app.route('/css/<path:filename>')
def css(filename):
    return send_from_directory('css', filename)

@app.route('/data/<path:filename>')
def data(filename):
    return send_from_directory('data', filename)

@app.route('/data/routes/<path:filename>')
def route_data(filename):
    return send_from_directory('data/routes', filename)

@app.route('/data/countries/<path:filename>')
def country_data(filename):
    return send_from_directory('data/countries', filename)

@app.route('/images/<path:filename>')
def images(filename):
    return send_from_directory('images', filename)

# SEO-friendly destination URLs: /destination/phuket
@app.route('/destination/<destination_name>')
def destination_page(destination_name):
    # Read the destination index.html file
    with open('destination/index.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Replace the JavaScript to use the destination from URL path
    script_replacement = f'''
    <script>
        // Function to format destination name (replace underscores and hyphens with spaces and capitalize properly)
        function formatDestinationName(dest) {{
            return dest.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
        }}

        // Extract destination from URL path
        function getDestinationFromPath() {{
            const pathSegments = window.location.pathname.split('/').filter(segment => segment);
            const destinationIndex = pathSegments.indexOf('destination');
            if (destinationIndex !== -1 && pathSegments.length >= destinationIndex + 2) {{
                return pathSegments[destinationIndex + 1];
            }}
            return '';
        }}

        const destination = getDestinationFromPath();
        const formattedDestination = formatDestinationName(destination);
        const destLower = destination.toLowerCase().replace(/ /g, '_');
        const jsonUrl = `/data/hotels/${{destLower}}.json`;

        // Update meta tags dynamically
        const seoTitle = `Best Hotel Deals in ${{formattedDestination}} | Luxury Hotels & Resorts | ExploraMondo`;
        const seoDescription = `Find the best hotel deals in ${{formattedDestination}}. Compare prices, read reviews, and book luxury hotels with exclusive discounts. Best rates guaranteed.`;
        const seoKeywords = `hotels in ${{formattedDestination}}, ${{formattedDestination}} hotel deals, luxury hotels ${{formattedDestination}}, best hotels ${{formattedDestination}}, hotel booking ${{formattedDestination}}`;
        
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
        
        if (titleElement) titleElement.textContent = `Best Hotel Deals in ${{formattedDestination}}`;
        if (descriptionElement) descriptionElement.textContent = `Discover amazing hotel deals and luxury accommodations in ${{formattedDestination}}. Book with confidence and enjoy exclusive discounts.`;

        // Global variables and functions
        let allHotels = [];
        
        function sortHotels(sortType) {{
          if (!allHotels || !allHotels.length) return;
          
          let sortedHotels = [...allHotels];
          
          switch(sortType) {{
            case 'price-low':
              sortedHotels.sort((a, b) => a.price - b.price);
              break;
            case 'price-high':
              sortedHotels.sort((a, b) => b.price - a.price);
              break;
            case 'name':
              sortedHotels.sort((a, b) => a.vendor_name.localeCompare(b.vendor_name));
              break;
            case 'rating':
              // For now, keep original order since we don't have ratings
              break;
            default:
              break;
          }}
          
          displayHotels(sortedHotels);
        }}

        function displayHotels(hotels) {{
          const container = document.getElementById('hotel-container');
          if (!container) return;
          
          container.innerHTML = '';
          if (!hotels || !hotels.length) {{
            container.innerHTML = '<p>No hotel data available for this destination.</p>';
            return;
          }}
          
          hotels.slice(0, 8).forEach(hotel => {{
            const card = document.createElement('div');
            card.className = 'hotel-card';
            card.innerHTML = `
              <a href="${{hotel.link}}" target="_blank">
                <div class="hotel-image-container">
                  <img src="${{hotel.hero_image}}" alt="${{hotel.vendor_name}}" />
                  <div class="hotel-price"><del>$${{hotel.value}}</del> $${{hotel.price}}</div>
                </div>
                <div class="hotel-card-content">
                  <h4>${{hotel.vendor_name}}</h4>
                  <div class="hotel-location">${{hotel.location_heading}}, ${{hotel.location_subheading}}</div>
                  <p>${{hotel.title.length > 100 ? hotel.title.substring(0, 100) + '...' : hotel.title}}</p>
                  <a href="${{hotel.link}}" target="_blank" class="view-deal-btn">View Deal</a>
                </div>
              </a>`;
            container.appendChild(card);
          }});
        }}

        // Wait for DOM to be ready before doing anything
        document.addEventListener('DOMContentLoaded', function() {{
          // Set hero background
          const heroSection = document.querySelector('.hero-section');
          if (heroSection) {{
            heroSection.style.backgroundImage = `url('https://images.unsplash.com/photo-1468413253725-0d5181091126?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`;
          }}
          
          // Add sorting functionality
          const sortSelect = document.getElementById('sortSelect');
          if (sortSelect) {{
            sortSelect.addEventListener('change', function() {{
              const sortType = this.value;
              sortHotels(sortType);
            }});
          }}

          // Load hotel data
          console.log('Fetching hotel data from:', jsonUrl);
          fetch(jsonUrl)
            .then(response => {{
              console.log('Response status:', response.status);
              if (!response.ok) throw new Error("Hotel data not found");
              return response.json();
            }})
            .then(hotels => {{
              console.log('Hotels loaded:', hotels.length);
              allHotels = hotels;
              displayHotels(hotels);
            }})
            .catch(error => {{
              console.error("Hotel fetch error:", error);
              const container = document.getElementById('hotel-container');
              if (container) {{
                container.innerHTML = `<p>No hotel data available for this destination. Error: ${{error.message}}</p>`;
              }}
            }});
        }});
    </script>
    '''
    
    # Find and replace the entire script section
    start_script = html_content.find('<script>')
    end_script = html_content.find('</script>', start_script)
    
    if start_script != -1 and end_script != -1:
        # Replace the entire script section
        html_content = html_content[:start_script] + script_replacement + html_content[end_script + 9:]
    
    return html_content

# SEO-friendly route URLs: /route/from/to
@app.route('/route/<from_location>/<to_location>')
def route_page(from_location, to_location):
    # Read the route index.html file
    with open('route/index.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Replace the JavaScript to use the locations from URL path
    script_replacement = f'''
    <script>
        // Function to format destination name (replace underscores and hyphens with spaces and capitalize properly)
        function formatDestinationName(dest) {{
            return dest.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
        }}

        // Extract origin and destination from URL path
        function getRouteFromPath() {{
            const pathSegments = window.location.pathname.split('/').filter(segment => segment);
            
            // Look for 'route' in the path and get the next two segments
            const routeIndex = pathSegments.indexOf('route');
            if (routeIndex !== -1 && pathSegments.length >= routeIndex + 3) {{
                return {{
                    origin: pathSegments[routeIndex + 1],
                    destination: pathSegments[routeIndex + 2]
                }};
            }}
            
            // Fallback to query parameters for backward compatibility
            const params = new URLSearchParams(window.location.search);
            return {{
                origin: params.get('origin') || '',
                destination: params.get('destination') || ''
            }};
        }}

        const {{ origin, destination }} = getRouteFromPath();
        
        // Format both origin and destination names for display
        const formattedOrigin = formatDestinationName(origin);
        const formattedDestination = formatDestinationName(destination);

        const destLower = destination.toLowerCase().replace(/ /g, '_');
        const jsonUrl = `/data/hotels/${{destLower}}.json`;

        // Update meta tags dynamically
        const seoTitle = `${{formattedOrigin}} to ${{formattedDestination}} | Compare Travel Modes & Hotel deals`;
        const seoDescription = `Compare travel modes from ${{formattedOrigin}} to ${{formattedDestination}} in ExploraMondo. Discover routes, compare travel modes, and explore luxury hotel promotions in ${{formattedDestination}}`;
        const seoKeywords = `travel routes, flights, trains, buses, hotels, ${{formattedOrigin}} to ${{formattedDestination}}, travel comparison`;
        
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
        document.getElementById('breadcrumb-current').textContent = `${{formattedOrigin}} to ${{formattedDestination}}`;

        document.getElementById('route-heading').textContent = `${{formattedOrigin}} to ${{formattedDestination}}`;
        document.getElementById('route-description').textContent = `Discover and compare the fastest, cheapest and most convenient travel modes between ${{formattedOrigin}} and ${{formattedDestination}}, including flights, trains, buses and ferries.`;

        // Pre-fill search inputs
        document.getElementById('origin-input').value = formattedOrigin;
        document.getElementById('destination-input').value = formattedDestination;

        document.getElementById('deal-title').textContent = `Best Hotel Deals in ${{formattedDestination}}`;
        document.getElementById('deal-subtitle').textContent = `Explore top-rated luxury hotel deals and discounts near ${{formattedDestination}}. Stay in comfort, close to key locations including beaches, hospitals, and city centers.`;

        // Generate travel mode cards from route-specific data
        function generateTravelModes() {{
          const routeKey = `${{origin.toLowerCase()}}_${{destination.toLowerCase()}}`;
          const routeDataUrl = `/data/routes/${{routeKey}}.json`;
          
          fetch(routeDataUrl)
            .then(response => {{
              if (!response.ok) {{
                // Fallback to default modes if route data not found
                generateDefaultModes();
                return;
              }}
              return response.json();
            }})
            .then(routeData => {{
              if (routeData && routeData.travel_modes) {{
                displayRouteModes(routeData.travel_modes, routeData.quick_tips);
              }} else {{
                generateDefaultModes();
              }}
            }})
            .catch(error => {{
              console.warn("Route data not found, using default modes:", error);
              generateDefaultModes();
            }});
        }}

        function displayRouteModes(modes, tips) {{
          const container = document.getElementById('travel-modes-container');
          container.innerHTML = '';

          modes.forEach(mode => {{
            const card = document.createElement('div');
            card.className = 'travel-mode-card';
            
            // Build providers section if available
            let providersHtml = '';
            if (mode.providers && mode.providers.length > 0) {{
              providersHtml = `
                <div class="mode-providers">
                  <h4>Main Providers:</h4>
                  <div class="provider-links">
                    ${{mode.providers.map(provider => `
                      <a href="${{provider.website}}" target="_blank" class="provider-link">
                        ${{provider.name}}
                        ${{provider.direct ? '<span class="direct-badge">Direct</span>' : ''}}
                      </a>
                    `).join('')}}
                  </div>
                </div>
              `;
            }}
            
            // Build booking links section
            let bookingHtml = '';
            if (mode.booking_links) {{
              bookingHtml = `
                <div class="mode-booking">
                  <h4>Book Online:</h4>
                  <div class="booking-links">
                    ${{Object.entries(mode.booking_links).map(([name, url]) => `
                      <a href="${{url}}" target="_blank" class="booking-link">
                        ${{name.replace('_', ' ').toUpperCase()}}
                      </a>
                    `).join('')}}
                  </div>
                </div>
              `;
            }}
            
            card.innerHTML = `
              <div class="mode-header">
                <div class="mode-icon">${{mode.icon}}</div>
                <h3>${{mode.name}}</h3>
              </div>
              <p class="mode-description">${{mode.description}}</p>
              <div class="mode-details">
                <div class="detail-item">
                  <span class="label">Time:</span>
                  <span class="value">${{mode.estimated_time}}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Cost:</span>
                  <span class="value">${{mode.estimated_cost}}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Frequency:</span>
                  <span class="value">${{mode.frequency}}</span>
                </div>
              </div>
              ${{providersHtml}}
              ${{bookingHtml}}
            `;
            container.appendChild(card);
          }});

          // Update quick tips if available
          if (tips && tips.length > 0) {{
            const tipsContainer = document.getElementById('quick-tips-list');
            if (tipsContainer) {{
              tipsContainer.innerHTML = tips.map(tip => `<li>${{tip}}</li>`).join('');
            }}
          }}
        }}

        function generateDefaultModes() {{
          const defaultModes = [
            {{
              icon: '✈️',
              name: 'Flight',
              description: 'Fastest option for long distances',
              estimated_time: '2-8 hours',
              estimated_cost: '$200-800',
              frequency: 'Daily'
            }},
            {{
              icon: '🚄',
              name: 'Train',
              description: 'Scenic and comfortable for medium distances',
              estimated_time: '4-12 hours',
              estimated_cost: '$50-300',
              frequency: 'Daily'
            }},
            {{
              icon: '🚌',
              name: 'Bus',
              description: 'Budget-friendly option for shorter distances',
              estimated_time: '6-24 hours',
              estimated_cost: '$20-100',
              frequency: 'Multiple daily'
            }},
            {{
              icon: '🚗',
              name: 'Car',
              description: 'Flexible and convenient for road trips',
              estimated_time: '8-20 hours',
              estimated_cost: '$100-400',
              frequency: 'Anytime'
            }}
          ];

          displayRouteModes(defaultModes, []);
        }}

        // Function to handle travel mode comparison
        function compareMode(mode) {{
          const origin = document.getElementById('origin-input').value;
          const destination = document.getElementById('destination-input').value;
          
          // Open Rome2Rio with specific mode filter
          const rome2rioUrl = `https://www.rome2rio.com/map/${{origin}}/${{destination}}?mode=${{mode}}`;
          window.open(rome2rioUrl, '_blank');
        }}

        // Generate travel modes on page load
        generateTravelModes();

        fetch(jsonUrl)
          .then(response => {{
            if (!response.ok) throw new Error("Hotel data not found");
            return response.json();
          }})
          .then(hotels => {{
            const container = document.getElementById('hotel-container');
            container.innerHTML = '';
            hotels.slice(0, 4).forEach(hotel => {{
              const card = document.createElement('div');
              card.className = 'hotel-card';
              card.innerHTML = `
                <div class="hotel-image-container">
                  <img src="${{hotel.hero_image}}" alt="${{hotel.vendor_name}}" />
                  <div class="hotel-price"><del>$${{hotel.value}}</del> $${{hotel.price}}</div>
                </div>
                <div class="hotel-card-content">
                  <h4>${{hotel.vendor_name}}</h4>
                  <div class="hotel-location">${{hotel.location_heading}}, ${{hotel.location_subheading}}</div>
                  <p>${{hotel.title.length > 100 ? hotel.title.substring(0, 100) + '...' : hotel.title}}</p>
                  <a href="${{hotel.link}}" target="_blank" class="view-deal-btn">View Deal</a>
                </div>`;
              container.appendChild(card);
            }});
          }})
          .catch(error => {{
            console.warn("Hotel fetch error:", error);
            const container = document.getElementById('hotel-container');
            container.innerHTML = '<p>No hotel data available for this destination.</p>';
          }});
    </script>
    '''
    
    # Find and replace the entire script section
    start_script = html_content.find('<script>')
    end_script = html_content.find('</script>', start_script)
    
    if start_script != -1 and end_script != -1:
        # Replace the entire script section
        html_content = html_content[:start_script] + script_replacement + html_content[end_script + 9:]
    
    return html_content

@app.route('/country/<country>')
def country_page(country):
    """Country page with dynamic content"""
    try:
        # Load country data
        country_file = f'data/countries/{country}.json'
        if os.path.exists(country_file):
            with open(country_file, 'r', encoding='utf-8') as f:
                country_data = json.load(f)
        else:
            # Fallback to default data
            country_data = {
                "name": country.replace('_', ' ').title(),
                "stats": {"routes": 10, "cities": 5, "providers": 20},
                "popular_routes": [],
                "major_cities": [],
                "travel_tips": {}
            }
        
        # Load the country template
        with open('country/index.html', 'r', encoding='utf-8') as f:
            template = f.read()
        
        # Inject country data
        script_data = f"""
        <script>
            window.countryData = {json.dumps(country_data)};
        </script>
        """
        
        # Insert script before closing body tag
        template = template.replace('</body>', f'{script_data}</body>')
        
        return template
        
    except Exception as e:
        return f"Error loading country page: {str(e)}", 500

# Serve the main index.html
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Serve other static files
@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)

if __name__ == '__main__':
    print("🚀 Starting SEO-friendly server...")
    print("📍 Destination URLs: http://localhost:5000/destination/phuket")
    print("🛣️  Route URLs: http://localhost:5000/route/phuket/bangkok")
    print("🌍 Country URLs: http://localhost:5000/country/thailand")
    print("🏠 Home: http://localhost:5000")
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000))) 