// Admin Panel JavaScript

// Load posts on page load
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    loadSettings();
});

// Tab switching
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Show alert message
function showAlert(message, type = 'success') {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert ${type}`;
    alert.style.display = 'block';
    
    setTimeout(() => {
        alert.style.display = 'none';
    }, 3000);
}

// Blog Posts Management
document.getElementById('post-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const postId = document.getElementById('post-id').value;
    const post = {
        id: postId || Date.now().toString(),
        title: document.getElementById('title').value,
        excerpt: document.getElementById('excerpt').value,
        content: document.getElementById('content').value,
        status: document.getElementById('status').value,
        date: new Date().toISOString()
    };
    
    // Get existing posts
    let posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    if (postId) {
        // Update existing post
        const index = posts.findIndex(p => p.id === postId);
        if (index !== -1) {
            posts[index] = post;
        }
    } else {
        // Add new post
        posts.unshift(post);
    }
    
    // Save to localStorage
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    
    showAlert(postId ? 'Post updated successfully!' : 'Post created successfully!');
    resetForm();
    loadPosts();
});

// Load all posts
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const postList = document.getElementById('post-list');
    
    if (posts.length === 0) {
        postList.innerHTML = '<p style="color: #666;">No posts yet. Create your first post above!</p>';
        return;
    }
    
    postList.innerHTML = posts.map(post => `
        <div class="post-item">
            <div>
                <h3>${escapeHtml(post.title)}</h3>
                <div class="post-meta">${formatDate(post.date)} • ${post.status}</div>
            </div>
            <div class="post-actions">
                <button class="btn" onclick="editPost('${post.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deletePost('${post.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Edit post
function editPost(postId) {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        document.getElementById('post-id').value = post.id;
        document.getElementById('title').value = post.title;
        document.getElementById('excerpt').value = post.excerpt;
        document.getElementById('content').value = post.content;
        document.getElementById('status').value = post.status;
        
        // Scroll to form
        document.getElementById('post-form').scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete post
function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }
    
    let posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    posts = posts.filter(p => p.id !== postId);
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    
    showAlert('Post deleted successfully!');
    loadPosts();
}

// Reset form
function resetForm() {
    document.getElementById('post-form').reset();
    document.getElementById('post-id').value = '';
}

// Settings Management
document.getElementById('settings-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const settings = {
        publicKey: document.getElementById('public-key').value,
        serviceId: document.getElementById('service-id').value,
        templateId: document.getElementById('template-id').value
    };
    
    localStorage.setItem('emailjsSettings', JSON.stringify(settings));
    showAlert('Settings saved successfully!');
});

// Load settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('emailjsSettings') || '{}');
    
    if (settings.publicKey) {
        document.getElementById('public-key').value = settings.publicKey;
    }
    if (settings.serviceId) {
        document.getElementById('service-id').value = settings.serviceId;
    }
    if (settings.templateId) {
        document.getElementById('template-id').value = settings.templateId;
    }
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}
