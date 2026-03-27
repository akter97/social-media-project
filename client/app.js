const postsContainer = document.getElementById('posts');
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
let editingPostId = null;
// Get logged-in user 
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

        // Preview comments
        let previewHTML = comments.slice(0, 3).map(c =>
            `<div class="comment"><b>${c.commentedUsername}</b> ${c.commentText}</div>`
        ).join('');

        // All comments
        let allCommentsHTML = comments.map(c =>
            `<div class="comment"><b>${c.commentedUsername}</b> ${c.commentText}</div>`
        ).join('');

        // Owner actions (Edit/Delete) 
      let ownerActions = '';
        if (post.postedUserId === currentUser.userId) {
            ownerActions = `
                <div class="owner-actions">
                    <button class="edit-btn" onclick="editPost(${post.postId}, '${post.postText}', '${post.postImageUrl || ''}')">Edit</button>
                    <button class="delete-btn" onclick="deletePost(${post.postId})">Delete</button>
                </div>
            `;
        }

        const postCard = document.createElement('div');
        postCard.className = 'post-card';

        postCard.innerHTML = `
            <div class="post-header">
                <img src="${post.postedUserImage}">
                <h3>${post.postedUserName}</h3>
            </div>
            <div class="post-text">${post.postText}</div>
            ${post.postImageUrl ? `<img class="post-image" src="${post.postImageUrl}">` : ''}
            ${ownerActions}
            <div class="post-actions">
                <div class="comment-btn" onclick="toggleComments(${post.postId})">Comment</div>
                <div class="comment-btn" onclick="toggleCommentsAll(${post.postId})">${comments.length} Comments</div>
            </div>
            <div id="commentBox-${post.postId}" class="comment-box" style="display:none;">
                <input type="text" id="commentInput-${post.postId}" placeholder="Write a comment...">
                <button onclick="addComment(${post.postId})">Send</button>
            </div>
            <div id="preview-${post.postId}" class="comments-preview">${previewHTML || 'No comments yet'}</div>
            <div id="all-${post.postId}" class="comments-preview" style="display:none;">${allCommentsHTML}</div>
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
 


function editPost(postId, postText, postImageUrl) {
    editingPostId = postId;
    document.getElementById('text').value = postText;
    document.getElementById('image').value = postImageUrl;
    openPostModal();
}

 async function deletePost(postId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "This post will be deleted permanently!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await fetch(`http://localhost:5000/api/posts/${postId}`, {
                method: 'DELETE'
            });
            Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
            fetchPosts();
        }
    });
}
// Update createPost to handle edit
async function createPost() {
    const postText = document.getElementById('text').value;
    const postImageUrl = document.getElementById('image').value;

    if (!postText) return alert('Post text required!');

    if (editingPostId) {
        // Update existing post
        await fetch(`http://localhost:5000/api/posts/${editingPostId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ postText, postImageUrl })
        });
        editingPostId = null;
    } else {
        // Create new post
        await fetch('http://localhost:5000/api/posts', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                postedUserId: currentUser.userId,
                postText,
                postImageUrl
            })
        });
    }

    document.getElementById('text').value = '';
    document.getElementById('image').value = '';
    closePostModal();
    fetchPosts();
}


// Initial Load
fetchPosts();