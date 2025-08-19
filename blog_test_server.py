#!/usr/bin/env python3
"""
Blog Test Server with Blogger Login and Post Creator Interface
This server includes authentication and post creation without database dependencies
"""

from flask import Flask, render_template_string, send_from_directory, request, redirect, url_for, session, flash
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'test-secret-key-for-blog'

# Mock data for testing
MOCK_USERS = {
    'blogger1': {
        'username': 'blogger1',
        'email': 'blogger1@example.com',
        'password': 'password123',
        'full_name': 'John Traveler',
        'bio': 'Passionate travel writer exploring the world',
        'profile_picture_url': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    'blogger2': {
        'username': 'blogger2',
        'email': 'blogger2@example.com',
        'password': 'password123',
        'full_name': 'Sarah Explorer',
        'bio': 'Adventure seeker and culture enthusiast',
        'profile_picture_url': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
}

MOCK_POSTS = [
    {
        'id': 1,
        'title': 'Amazing Adventures in Thailand',
        'slug': 'amazing-adventures-thailand',
        'excerpt': 'Discover the hidden gems of Thailand...',
        'content': 'Thailand is a beautiful country with amazing culture...',
        'status': 'published',
        'created_at': '2024-01-15',
        'author': MOCK_USERS['blogger1'],
        'views': 1250
    },
    {
        'id': 2,
        'title': 'Exploring the Streets of Tokyo',
        'slug': 'exploring-tokyo-streets',
        'excerpt': 'A journey through the vibrant streets of Tokyo...',
        'content': 'Tokyo is a city that never sleeps...',
        'status': 'published',
        'created_at': '2024-01-20',
        'author': MOCK_USERS['blogger2'],
        'views': 890
    }
]

# Static file routes
@app.route('/css/<path:filename>')
def css(filename):
    return send_from_directory('css', filename)

@app.route('/images/<path:filename>')
def images(filename):
    return send_from_directory('images', filename)

# Authentication routes
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username in MOCK_USERS and MOCK_USERS[username]['password'] == password:
            session['user_id'] = username
            session['user_data'] = MOCK_USERS[username]
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password', 'error')
    
    return render_template_string('''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blogger Login - MondoExplora</title>
    <link rel="stylesheet" href="{{ url_for('css', filename='blog.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="blog-reset">
    <div class="blog-container">
        <header class="blog-header">
            <div class="blog-header-content">
                <a href="/" class="blog-logo">MondoExplora Blog</a>
                <nav>
                    <ul class="blog-nav">
                        <li><a href="/">Home</a></li>
                        <li><a href="/login">Login</a></li>
                    </ul>
                </nav>
            </div>
        </header>

        <main class="blog-main">
            {% with messages = get_flashed_messages(with_categories=true) %}
                {% if messages %}
                    {% for category, message in messages %}
                        <div class="blog-alert blog-alert-{{ 'error' if category == 'error' else category }}">
                            {{ message }}
                        </div>
                    {% endfor %}
                {% endif %}
            {% endwith %}

            <div class="blog-form-container">
                <div class="blog-form">
                    <h2 class="blog-form-title">Blogger Login</h2>
                    <form method="POST">
                        <div class="blog-form-group">
                            <label class="blog-form-label">Username</label>
                            <input type="text" name="username" class="blog-form-input" required>
                        </div>
                        <div class="blog-form-group">
                            <label class="blog-form-label">Password</label>
                            <input type="password" name="password" class="blog-form-input" required>
                        </div>
                        <button type="submit" class="blog-form-button">Login</button>
                    </form>
                    
                    <div class="blog-mt-3 blog-text-center">
                        <p><strong>Test Accounts:</strong></p>
                        <p>Username: <code>blogger1</code> or <code>blogger2</code></p>
                        <p>Password: <code>password123</code></p>
                    </div>
                </div>
            </div>
        </main>

        <footer class="blog-footer blog-text-center blog-p-4" style="background: #2d3748; color: white; margin-top: 3rem;">
            <p>&copy; 2024 MondoExplora Blog. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>
    ''')

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully', 'success')
    return redirect(url_for('home'))

# Main routes
@app.route('/')
def home():
    """Blog homepage with posts"""
    return render_template_string('''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MondoExplora Blog</title>
    <link rel="stylesheet" href="{{ url_for('css', filename='blog.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="blog-reset">
    <div class="blog-container">
        <header class="blog-header">
            <div class="blog-header-content">
                <a href="/" class="blog-logo">MondoExplora Blog</a>
                <nav>
                    <ul class="blog-nav">
                        <li><a href="/">Home</a></li>
                        {% if session.get('user_id') %}
                            <li><a href="/dashboard">Dashboard</a></li>
                            <li><a href="/logout">Logout</a></li>
                        {% else %}
                            <li><a href="/login">Login</a></li>
                        {% endif %}
                    </ul>
                </nav>
            </div>
        </header>

        <main class="blog-main">
            <div class="blog-content">
                <div class="blog-p-4">
                    <h1 class="blog-post-detail-title">🎉 Welcome to MondoExplora Blog</h1>
                    <p class="blog-mb-4">Discover amazing travel stories from our community of bloggers.</p>
                    
                    <div class="blog-posts-grid">
                        {% for post in posts %}
                        <a href="/post/{{ post.slug }}" class="blog-post-card">
                            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop" alt="{{ post.title }}" class="blog-post-image">
                            <div class="blog-post-content">
                                <h3 class="blog-post-title">{{ post.title }}</h3>
                                <p class="blog-post-excerpt">{{ post.excerpt }}</p>
                                <div class="blog-post-meta">
                                    <div class="blog-post-author">
                                        <img src="{{ post.author.profile_picture_url }}" alt="{{ post.author.full_name }}" class="blog-author-avatar">
                                        <span>{{ post.author.full_name }}</span>
                                    </div>
                                    <span>{{ post.created_at }}</span>
                                </div>
                            </div>
                        </a>
                        {% endfor %}
                    </div>
                </div>
            </div>
        </main>

        <footer class="blog-footer blog-text-center blog-p-4" style="background: #2d3748; color: white; margin-top: 3rem;">
            <p>&copy; 2024 MondoExplora Blog. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>
    ''', posts=MOCK_POSTS)

@app.route('/dashboard')
def dashboard():
    """Blogger dashboard"""
    if not session.get('user_id'):
        flash('Please login first', 'error')
        return redirect(url_for('login'))
    
    user_data = session.get('user_data')
    user_posts = [post for post in MOCK_POSTS if post['author']['username'] == user_data['username']]
    
    return render_template_string('''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blogger Dashboard - MondoExplora</title>
    <link rel="stylesheet" href="{{ url_for('css', filename='blog.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="blog-reset">
    <div class="blog-container">
        <header class="blog-header">
            <div class="blog-header-content">
                <a href="/dashboard" class="blog-logo">Blogger Dashboard</a>
                <nav>
                    <ul class="blog-nav">
                        <li><a href="/">View Blog</a></li>
                        <li><a href="/dashboard">Dashboard</a></li>
                        <li><a href="/create-post">Create Post</a></li>
                        <li><a href="/logout">Logout</a></li>
                    </ul>
                </nav>
            </div>
        </header>

        <main class="blog-main">
            {% with messages = get_flashed_messages(with_categories=true) %}
                {% if messages %}
                    {% for category, message in messages %}
                        <div class="blog-alert blog-alert-{{ 'error' if category == 'error' else category }}">
                            {{ message }}
                        </div>
                    {% endfor %}
                {% endif %}
            {% endwith %}

            <div class="blog-dashboard">
                <div class="blog-sidebar">
                    <h3 class="blog-mb-3">Welcome, {{ user_data.full_name }}!</h3>
                    <ul class="blog-sidebar-menu">
                        <li><a href="/dashboard" class="active">Dashboard</a></li>
                        <li><a href="/create-post">Create New Post</a></li>
                        <li><a href="/my-posts">My Posts</a></li>
                        <li><a href="/profile">Profile</a></li>
                    </ul>
                </div>
                
                <div class="blog-dashboard-content">
                    <h1 class="blog-dashboard-title">Dashboard</h1>
                    
                    <div class="blog-stats-grid">
                        <div class="blog-stat-card">
                            <div class="blog-stat-number">{{ user_posts|length }}</div>
                            <div class="blog-stat-label">My Posts</div>
                        </div>
                        <div class="blog-stat-card">
                            <div class="blog-stat-number">{{ user_posts|selectattr('status', 'equalto', 'published')|list|length }}</div>
                            <div class="blog-stat-label">Published</div>
                        </div>
                        <div class="blog-stat-card">
                            <div class="blog-stat-number">{{ user_posts|sum(attribute='views') }}</div>
                            <div class="blog-stat-label">Total Views</div>
                        </div>
                    </div>

                    <h3 class="blog-mt-4">Recent Posts</h3>
                    <table class="blog-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Views</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {% for post in user_posts %}
                            <tr>
                                <td>{{ post.title }}</td>
                                <td><span class="blog-btn blog-btn-success blog-btn-small">{{ post.status }}</span></td>
                                <td>{{ post.views }}</td>
                                <td>{{ post.created_at }}</td>
                                <td>
                                    <a href="/edit-post/{{ post.id }}" class="blog-btn blog-btn-primary blog-btn-small">Edit</a>
                                </td>
                            </tr>
                            {% endfor %}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>

        <footer class="blog-footer blog-text-center blog-p-4" style="background: #2d3748; color: white; margin-top: 3rem;">
            <p>&copy; 2024 MondoExplora Blog. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>
    ''')

@app.route('/create-post', methods=['GET', 'POST'])
def create_post():
    """Create new blog post"""
    if not session.get('user_id'):
        flash('Please login first', 'error')
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('content')
        excerpt = request.form.get('excerpt')
        
        # In a real app, this would save to database
        flash('Post created successfully! (Demo mode)', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template_string('''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Post - MondoExplora</title>
    <link rel="stylesheet" href="{{ url_for('css', filename='blog.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="blog-reset">
    <div class="blog-container">
        <header class="blog-header">
            <div class="blog-header-content">
                <a href="/dashboard" class="blog-logo">Blogger Dashboard</a>
                <nav>
                    <ul class="blog-nav">
                        <li><a href="/">View Blog</a></li>
                        <li><a href="/dashboard">Dashboard</a></li>
                        <li><a href="/create-post">Create Post</a></li>
                        <li><a href="/logout">Logout</a></li>
                    </ul>
                </nav>
            </div>
        </header>

        <main class="blog-main">
            <div class="blog-form-container">
                <div class="blog-form">
                    <h2 class="blog-form-title">Create New Blog Post</h2>
                    <form method="POST">
                        <div class="blog-form-group">
                            <label class="blog-form-label">Post Title</label>
                            <input type="text" name="title" class="blog-form-input" placeholder="Enter your post title" required>
                        </div>
                        <div class="blog-form-group">
                            <label class="blog-form-label">Excerpt</label>
                            <textarea name="excerpt" class="blog-form-textarea" placeholder="Brief description of your post" rows="3"></textarea>
                        </div>
                        <div class="blog-form-group">
                            <label class="blog-form-label">Content</label>
                            <textarea name="content" class="blog-form-textarea" placeholder="Write your blog post content here..." rows="15" required></textarea>
                        </div>
                        <div class="blog-form-group">
                            <label class="blog-form-label">Keywords</label>
                            <input type="text" name="keywords" class="blog-form-input" placeholder="travel, adventure, culture (comma separated)">
                        </div>
                        <div class="blog-form-group">
                            <label class="blog-form-label">Countries</label>
                            <input type="text" name="countries" class="blog-form-input" placeholder="Thailand, Japan, Italy (comma separated)">
                        </div>
                        <button type="submit" class="blog-form-button">Create Post</button>
                    </form>
                </div>
            </div>
        </main>

        <footer class="blog-footer blog-text-center blog-p-4" style="background: #2d3748; color: white; margin-top: 3rem;">
            <p>&copy; 2024 MondoExplora Blog. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>
    ''')

if __name__ == '__main__':
    print("🚀 Blog Test Server with Blogger Interface")
    print("📍 Server running on http://localhost:5000")
    print("")
    print("📁 Available routes:")
    print("   - / (blog homepage)")
    print("   - /login (blogger login)")
    print("   - /dashboard (blogger dashboard)")
    print("   - /create-post (create new post)")
    print("")
    print("👤 Test Accounts:")
    print("   Username: blogger1 or blogger2")
    print("   Password: password123")
    print("")
    print("🔍 Open http://localhost:5000/login to test the blogger interface!")
    print("")
    
    app.run(debug=True, host='0.0.0.0', port=5000) 