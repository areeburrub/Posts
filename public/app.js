const createBtn = document.getElementById('createBtn')
const popup = document.getElementById('create-popup')
const form = document.getElementById('create-form')
const database = firebase.database();


createBtn.onclick = (e) =>{
    e.preventDefault();
    popup.hidden = false
}




const inputTitle = document.getElementById('input-title');
const inputTopic = document.getElementById('input-topic');
const inputText = document.getElementById('input-text');
form.onsubmit = (e) =>{
    e.preventDefault();
    database.ref('/Posts2').push().set({
        'Title':inputTitle.value,
        'Topic':inputTopic.value,
        'Text': inputText.value,
        'uid':auth.currentUser.uid,
        'createdBy':auth.currentUser.displayName,
        'createdOn' : Date.now()
    })
    inputTitle.value = '';
    inputTopic.value = '';
    inputText.value = '';
    
    popup.hidden = true
}



const postContainer = document.getElementById('posts-container');
const drawPosts = (post) => {
    postContainer.innerHTML += `
        <div class="post">
        <marquee id="post-title">${post.Title}</marquee>
        <h6 class="post-topic">Topic: <span id="post-topic">${post.Topic}</span></h6>
        <h6 class="post-topic">by: <span id="post-topic">${post.createdBy}</span></h6>
        <p>${post.Text}</p>
        </div>
        
        `    
}



database.ref('/Posts2').on('value',(snapshot)=>{
    data = snapshot.val();
    postContainer.innerHTML = '';
    for (var PostID in data){drawPosts(data[PostID]);}
})

const showTopic = document.getElementById('show-topic');
showTopic.onchange = () => {
    database.ref('/Posts2').off();
    
    if(showTopic.value == 'All Posts'){
        database.ref('/Posts2').on('value',(snapshot)=>{
            data = snapshot.val();
            postContainer.innerHTML = '';
            for (var PostID in data){drawPosts(data[PostID]);}
        })
    }
    else{
        database.ref('/Posts2').orderByChild('Topic').equalTo(showTopic.value).on('value',(snapshot)=>{
            data = snapshot.val();
            postContainer.innerHTML = '';
            for (var PostID in data){drawPosts(data[PostID]);}
        })
    }
    
}

//Authentication Part Start here

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

const userCard = document.getElementById('user-card');
const userImg = document.getElementById('user-img');
const username = document.getElementById('username');

loginBtn.onclick = () => auth.signInWithPopup(provider);
logoutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user=>{
    if(user){
        userCard.hidden = false;
        loginBtn.hidden = true;
        createBtn.hidden = false;
        userImg.src = user.photoURL;
        username.innerHTML = user.displayName;
        
    }
    else{
        userCard.hidden = true;
        loginBtn.hidden = false;
        createBtn.hidden = true;
    }
})