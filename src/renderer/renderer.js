document.addEventListener('DOMContentLoaded', displayNotes);
document.getElementById('add-note-btn').addEventListener('click', addNewNote);
document.querySelector('.note-list').addEventListener('click', deleteNote);
document.getElementById('delete-all-btn').addEventListener('click', deleteAllNotes);

const noteListDiv = document.querySelector('.note-list');
let noteID = 1;
let allNotes = [];

function Note(id, title, content) {
    this.id = id;
    this.title = title;
    this.content = content;
}


async function displayNotes() {
    allNotes = await window.electronAPI.loadNotes();
    if (allNotes.length > 0) {
        noteID = allNotes[allNotes.length - 1].id + 1;
    } else {
        noteID = 1;
    }
    allNotes.forEach(item => createNoteDOM(item));
}


function addNewNote() {
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');

    if (validateInput(noteTitle, noteContent)) {
        const noteItem = new Note(noteID, noteTitle.value, noteContent.value);
        noteID++;
        allNotes.push(noteItem);
        createNoteDOM(noteItem);
        saveNotes();
        noteTitle.value = "";
        noteContent.value = "";
    }
}

function saveNotes() {
    window.electronAPI.saveNote(allNotes);
}


function validateInput(title, content) {
    if (title.value !== "" && content.value !== "") {
        return true;
    } else {
        if (title.value === "") title.classList.add('warning');
        if (content.value === "") content.classList.add('warning');
    }
    setTimeout(() => {
        title.classList.remove('warning');
        content.classList.remove('warning');
    }, 1500);
}


function createNoteDOM(noteItem) {
    const div = document.createElement('div');
    div.classList.add('note-item');
    div.setAttribute('data-id', noteItem.id);
    div.innerHTML = `
        <h3>${noteItem.title}</h3>
        <p>${noteItem.content}</p>
        <button type="button" class="btn delete-note-btn">
            <span><i class="fas fa-trash"></i></span>
            Remove
        </button>
    `;
    noteListDiv.appendChild(div);
}


function deleteNote(e) {
    if (e.target.closest('.delete-note-btn')) {
        const noteDiv = e.target.closest('.note-item');
        const noteId = parseInt(noteDiv.getAttribute('data-id'));
        allNotes = allNotes.filter(note => note.id !== noteId); 
        noteDiv.remove();
        saveNotes();
    }
}


function deleteAllNotes() {
    noteListDiv.innerHTML = '';
    allNotes = []; 
    saveNotes();
    noteID = 1;
}
