const postsContainer = document.getElementById('posts');

// Get logged-in user
 
// Get logged-in user
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'index.html';
} else {
    // Show user info in nav
    document.getElementById('userImage').src = currentUser.userImage;
    document.getElementById('userName').textContent = currentUser.userName;
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Fetch Posts
async function fetchPosts() {
    const res = await fetch('http://localhost:5000/api/posts');
    const posts = await res.json();
    renderPosts(posts);
}

// Render Posts
 async function renderPosts(posts) {
    postsContainer.innerHTML = '';

    for (const post of posts) {

        // Fetch comments
        const res = await fetch(`http://localhost:5000/api/comments/${post.postId}`);
        const comments = await res.json();

        // First 5 comments
        let previewHTML = '';
        const previewComments = comments.slice(0, 3);

        previewComments.forEach(c => {
            previewHTML += `
                <div class="comment">
                    <b>${c.commentedUsername}</b> ${c.commentText}
                </div>
            `;
        });

        // All comments HTML
        let allCommentsHTML = '';
        comments.forEach(c => {
            allCommentsHTML += `
                <div class="comment">
                    <b>${c.commentedUsername}</b> ${c.commentText}
                </div>
            `;
        });

        const postCard = document.createElement('div');
        postCard.className = 'post-card';

        postCard.innerHTML = `
            <div class="post-header">
                <img src="${post.postedUserImage}">
                <h3>${post.postedUserName}</h3>
            </div>

            <div class="post-text">${post.postText}</div>

            ${post.postImageUrl ? `<img class="post-image" src="${post.postImageUrl}">` : ''}

            <div class="post-actions">
                <div class="comment-btn" onclick="toggleComments(${post.postId})">Comment</div>
                <div class="comment-btn" onclick="toggleCommentsAll(${post.postId})">${comments.length} Comments</div>
            </div>

            <div id="commentBox-${post.postId}" class="comment-box" style="display:none;">
                <input type="text" id="commentInput-${post.postId}" placeholder="Write a comment...">
                <button onclick="addComment(${post.postId})">Send</button>
            </div>

            <!-- Preview comments -->
            <div id="preview-${post.postId}" class="comments-preview">
                ${previewHTML || 'No comments yet'}
            </div>

            <!-- All comments -->
            <div id="all-${post.postId}" class="comments-preview" style="display:none;">
                ${allCommentsHTML}
            </div>
        `;

        postsContainer.appendChild(postCard);
    }
}
 function toggleComments(postId) {
    const preview = document.getElementById(`preview-${postId}`);
    const all = document.getElementById(`all-${postId}`);
    const box = document.getElementById(`commentBox-${postId}`);

    if (box.style.display === 'none') { 
        preview.style.display = 'none';
        box.style.display = 'flex';
    } else {
        all.style.display = 'none';
        preview.style.display = 'block';
        box.style.display = 'none';
    }
}
 function toggleCommentsAll(postId) {
    const preview = document.getElementById(`preview-${postId}`);
    const all = document.getElementById(`all-${postId}`); 

    if (all.style.display === 'none') {
        all.style.display = 'block';
        preview.style.display = 'none'; 
    } else {
        all.style.display = 'none';
        preview.style.display = 'block'; 
    }
}
// Open Comment Box
function openCommentBox(postId) {
    const box = document.getElementById(`commentBox-${postId}`);
    if (box.style.display === 'none') {
        box.style.display = 'flex';
    } else {
        box.style.display = 'none';
    }
}

// Add Comment
async function addComment(postId) {
    const input = document.getElementById(`commentInput-${postId}`);
    const commentText = input.value;

    if (!commentText) return alert('Write a comment');

    await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            commentOfPostId: postId,
            commentedUserId: currentUser.userId,
            commentText: commentText
        })
    });

    input.value = '';
    fetchPosts();
}


// Open Post Modal
function openPostModal() {
    const modal = document.getElementById('postModal');
    modal.style.display = 'block';
}

// Close Post Modal
function closePostModal() {
    const modal = document.getElementById('postModal');
    modal.style.display = 'none';
}
// Create Post
async function createPost() {
    const postText = document.getElementById('text').value;
    const postImageUrl = document.getElementById('image').value;

    if (!postText) return alert('Post text required!');

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

    closePostModal();
    fetchPosts();
}

// Initial Load
fetchPosts();