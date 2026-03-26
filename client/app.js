const postsContainer = document.getElementById('posts');


// Modal control
function openPostModal() {
    document.getElementById('postModal').style.display = 'block';
}

function closePostModal() {
    document.getElementById('postModal').style.display = 'none';
}

// Close modal if click outside
window.onclick = function(event) {
    const modal = document.getElementById('postModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


// Get logged-in user from localStorage
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if(!currentUser) {
    window.location.href = 'index.html'; // Not logged in
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Fetch posts from server
async function fetchPosts() {
    const res = await fetch('http://localhost:5000/api/posts');
    const posts = await res.json();
    renderPosts(posts);
}

// Render posts dynamically
function renderPosts(posts) {
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.innerHTML = `
            <div class="post-header">
                <img src="${post.postedUserImage}" alt="${post.postedUserName}">
                <h3>${post.postedUserName}</h3>
            </div>
            <div class="post-text">${post.postText}</div>
            ${post.postImageUrl ? `<img class="post-image" src="${post.postImageUrl}" alt="post image">` : ''}
        `;
        postsContainer.appendChild(postCard);
    });
}

// Create new post
async function createPost() {
    const postText = document.getElementById('text').value;
    const postImageUrl = document.getElementById('image').value;

    if(!postText) return alert('Post text is required');

    await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            postedUserId: currentUser.userId,
            postText,
            postImageUrl
        })
    });

    document.getElementById('text').value = '';
    document.getElementById('image').value = '';
    fetchPosts();
}

// Initial fetch
fetchPosts();