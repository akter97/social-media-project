const postsContainer = document.getElementById('posts');

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

// Render posts
 function renderPosts(posts) {
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';

        // Show only last 3 comments
        let commentsHTML = '';
        if(post.comments && post.comments.length > 0){
            const lastComments = post.comments.slice(0, 3);
            lastComments.forEach(c => {
                commentsHTML += `
                    <div class="comment">
                        <b>${c.commentedUsername}</b> ${c.commentText}
                    </div>
                `;
            });
        }

        postCard.innerHTML = `
            <div class="post-header">
                <img src="${post.postedUserImage}">
                <h3>${post.postedUserName}</h3>
            </div>

            <div class="post-text">${post.postText}</div>

            ${post.postImageUrl ? `<img class="post-image" src="${post.postImageUrl}">` : ''}

            <div class="post-actions">
                <div class="comment-btn" onclick="openComment(${post.postId})">
                    Comment
                </div>
                <div class="comment-count">
                    ${post.comments ? post.comments.length : 0} Comments
                </div>
            </div>

            <div class="comments-preview">
                ${commentsHTML}
            </div>
        `;

        postsContainer.appendChild(postCard);
    });
}

// Create new post
async function createPost() {
    const postedUserId = document.getElementById('userId').value;
    const postText = document.getElementById('text').value;
    const postImageUrl = document.getElementById('image').value;

    if(!postedUserId || !postText) return alert('User ID and Text required!');

    await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({postedUserId, postText, postImageUrl})
    });

    document.getElementById('userId').value = '';
    document.getElementById('text').value = '';
    document.getElementById('image').value = '';

    fetchPosts();
}

// Initial load
fetchPosts();