#!/usr/bin/env python3
"""
Simple test server to verify blog CSS isolation
This server only serves static files and basic routes without database
"""

from flask import Flask, render_template_string, send_from_directory
import os

app = Flask(__name__)

# Static file routes
@app.route('/css/<path:filename>')
def css(filename):
    return send_from_directory('css', filename)

@app.route('/images/<path:filename>')
def images(filename):
    return send_from_directory('images', filename)

# Test blog route with isolated CSS
@app.route('/')
def test_blog():
    """Test blog page with isolated CSS"""
    return render_template_string('''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog CSS Isolation Test</title>
    
    <!-- Blog-specific CSS only - completely isolated from main site -->
    <link rel="stylesheet" href="{{ url_for('css', filename='blog.css') }}">
    
    <!-- Google Fonts for blog only -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="blog-reset">
    <div class="blog-container">
        <!-- Blog Header -->
        <header class="blog-header">
            <div class="blog-header-content">
                <a href="#" class="blog-logo">
                    MondoExplora Blog
                </a>
                <nav>
                    <ul class="blog-nav">
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Search</a></li>
                        <li><a href="#">Login</a></li>
                        <li><a href="#">Register</a></li>
                    </ul>
                </nav>
            </div>
        </header>

        <!-- Blog Main Content -->
        <main class="blog-main">
            <div class="blog-content">
                <div class="blog-p-4">
                    <h1 class="blog-post-detail-title">🎉 Blog CSS Isolation Test</h1>
                    <p class="blog-mb-3">This page tests that the blog CSS is completely isolated from the main website.</p>
                    
                    <!-- Test Blog Components -->
                    <div class="blog-stats-grid">
                        <div class="blog-stat-card">
                            <div class="blog-stat-number">42</div>
                            <div class="blog-stat-label">Blog Posts</div>
                        </div>
                        <div class="blog-stat-card">
                            <div class="blog-stat-number">15</div>
                            <div class="blog-stat-label">Authors</div>
                        </div>
                        <div class="blog-stat-card">
                            <div class="blog-stat-number">1.2K</div>
                            <div class="blog-stat-label">Readers</div>
                        </div>
                    </div>

                    <!-- Test Blog Form -->
                    <div class="blog-form-container">
                        <div class="blog-form">
                            <h2 class="blog-form-title">Test Form</h2>
                            <div class="blog-form-group">
                                <label class="blog-form-label">Test Input</label>
                                <input type="text" class="blog-form-input" placeholder="This should use blog styles">
                            </div>
                            <div class="blog-form-group">
                                <label class="blog-form-label">Test Textarea</label>
                                <textarea class="blog-form-textarea" placeholder="This should use blog styles"></textarea>
                            </div>
                            <button class="blog-form-button">Test Button</button>
                        </div>
                    </div>

                    <!-- Test Blog Buttons -->
                    <div class="blog-mt-4">
                        <h3>Test Buttons</h3>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <button class="blog-btn blog-btn-primary">Primary Button</button>
                            <button class="blog-btn blog-btn-success">Success Button</button>
                            <button class="blog-btn blog-btn-danger">Danger Button</button>
                            <button class="blog-btn blog-btn-primary blog-btn-small">Small Button</button>
                        </div>
                    </div>

                    <!-- Test Blog Alerts -->
                    <div class="blog-mt-4">
                        <h3>Test Alerts</h3>
                        <div class="blog-alert blog-alert-success">
                            ✅ This is a success alert using blog CSS
                        </div>
                        <div class="blog-alert blog-alert-error">
                            ❌ This is an error alert using blog CSS
                        </div>
                        <div class="blog-alert blog-alert-info">
                            ℹ️ This is an info alert using blog CSS
                        </div>
                    </div>

                    <!-- Test Blog Table -->
                    <div class="blog-mt-4">
                        <h3>Test Table</h3>
                        <table class="blog-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>John Doe</td>
                                    <td>john@example.com</td>
                                    <td><span class="blog-btn blog-btn-success blog-btn-small">Active</span></td>
                                </tr>
                                <tr>
                                    <td>Jane Smith</td>
                                    <td>jane@example.com</td>
                                    <td><span class="blog-btn blog-btn-danger blog-btn-small">Inactive</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Test Blog Cards -->
                    <div class="blog-mt-4">
                        <h3>Test Post Cards</h3>
                        <div class="blog-posts-grid">
                            <a href="#" class="blog-post-card">
                                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop" alt="Test" class="blog-post-image">
                                <div class="blog-post-content">
                                    <h3 class="blog-post-title">Test Blog Post Title</h3>
                                    <p class="blog-post-excerpt">This is a test excerpt for the blog post card component.</p>
                                    <div class="blog-post-meta">
                                        <div class="blog-post-author">
                                            <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop&crop=face" alt="Author" class="blog-author-avatar">
                                            <span>Test Author</span>
                                        </div>
                                        <span>2 days ago</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div class="blog-mt-4 blog-text-center">
                        <p><strong>🎉 SUCCESS! If you can see this styled content, the blog CSS isolation is working correctly!</strong></p>
                        <p>All styles should be completely separate from the main website.</p>
                        <p class="blog-mt-2">
                            <strong>Test URLs:</strong><br>
                            <a href="/css/blog.css" class="blog-btn blog-btn-primary">View Blog CSS</a>
                            <a href="/css/country.css" class="blog-btn blog-btn-success">View Main CSS</a>
                        </p>
                    </div>
                </div>
            </div>
        </main>

        <!-- Blog Footer -->
        <footer class="blog-footer blog-text-center blog-p-4" style="background: #2d3748; color: white; margin-top: 3rem;">
            <p>&copy; 2024 MondoExplora Blog. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>
    ''')

if __name__ == '__main__':
    print("🚀 Blog CSS Isolation Test Server")
    print("📍 Server running on http://localhost:5000")
    print("🎨 Testing blog CSS isolation")
    print("")
    print("📁 Available routes:")
    print("   - / (blog CSS test page)")
    print("   - /css/blog.css (blog CSS file)")
    print("   - /css/country.css (main website CSS)")
    print("")
    print("🔍 Open http://localhost:5000 in your browser to test!")
    print("")
    
    app.run(debug=True, host='0.0.0.0', port=5000) 