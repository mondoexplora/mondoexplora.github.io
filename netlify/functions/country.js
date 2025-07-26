const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Extract country name from the URL path
    const pathSegments = event.path.split('/').filter(segment => segment);
    const countryIndex = pathSegments.indexOf('country');
    const countryName = pathSegments[countryIndex + 1];

    if (!countryName) {
      return {
        statusCode: 404,
        body: 'Country not found'
      };
    }

    // Load country data
    const countryFilePath = path.join(__dirname, `../../data/countries/${countryName}.json`);
    let countryData;
    
    try {
      if (fs.existsSync(countryFilePath)) {
        countryData = JSON.parse(fs.readFileSync(countryFilePath, 'utf8'));
      } else {
        // Fallback to default data
        countryData = {
          "name": countryName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          "stats": {"routes": 10, "cities": 5, "providers": 20},
          "popular_routes": [],
          "major_cities": [],
          "travel_tips": {}
        };
      }
    } catch (error) {
      console.error('Error loading country data:', error);
      // Fallback to default data
      countryData = {
        "name": countryName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        "stats": {"routes": 10, "cities": 5, "providers": 20},
        "popular_routes": [],
        "major_cities": [],
        "travel_tips": {}
      };
    }

    // Load the country template
    const templatePath = path.join(__dirname, '../../country/index.html');
    
    let template;
    try {
      template = fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
      console.error('Error loading template:', error);
      return {
        statusCode: 500,
        body: 'Template not found'
      };
    }

    // Inject country data
    const scriptData = `
    <script>
        window.countryData = ${JSON.stringify(countryData)};
    </script>
    `;

    // Insert script before closing body tag
    template = template.replace('</body>', `${scriptData}</body>`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600'
      },
      body: template
    };

  } catch (error) {
    console.error('Error in country function:', error);
    return {
      statusCode: 500,
      body: 'Internal server error'
    };
  }
}; 