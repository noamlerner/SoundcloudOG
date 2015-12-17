var skipUserInput = document.getElementById('skipUserInput');
var skipUsers = document.getElementById('skipUsers');
var skipUsersArr = [];
// Saves options to chrome.storage
function save_options() {
    console.log('called');
    var options = {};
    options.skipReposts = document.getElementById('skipReposts').checked;
    options.autoScroll = document.getElementById('autoScroll').checked;
    options.skipShort = document.getElementById('skipShort').checked;
    options.shorterThan = document.getElementById('shorterThan').value;
    options.skipLong = document.getElementById('skipLong').checked;
    options.longerThan = document.getElementById('longerThan').value;
    options.skipUser = document.getElementById('skipUser').checked;
    options.skipUsers = skipUsersArr;
    console.log(options);
    chrome.storage.sync.set(options, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        skipReposts: true,
        autoScroll: true,
        skipLong: false,
        skipShort: false,
        skipUser:false,
        shorterThan: '30',
        longerThan: '1:0:0',
        skipUsers:[]
    }, function(items) {
        Object.keys(items).forEach(function assignVals(key) {
            if (typeof items[key] === 'boolean') {
                document.getElementById(key).checked = items[key];
            } else if(key!== "skipUsers"){
                document.getElementById(key).value = items[key];
            } else {
                skipUsersArr = items[key];
                setSkipUsers(skipUsersArr);
            }
        });
    });  
}
document.addEventListener('DOMContentLoaded', restore_options);
var inputs = document.getElementsByTagName('input');
inputs = Array.prototype.slice.call(inputs);
inputs.forEach(function saveListen(input) {
    if (input.getAttribute('class') !== 'ignore') {
        if (input.getAttribute('type') === 'text') {
            input.addEventListener('input', save_options);
        } else {
            input.addEventListener('change', save_options);
        }
    }
}); 
document.getElementById("addSkipUser").onclick = function(){
    var user = skipUserInput.value.trim();
    addUserToSkipUsers(user);
    skipUsersArr.push(user);
    save_options();
    skipUserInput.value = "";
};
function addUserToSkipUsers(user){
    // create and append option
    var opt = document.createElement('option');
    var text = document.createTextNode(user);
    opt.appendChild(text);
    skipUsers.appendChild(opt);
    var size = skipUsers.getAttribute('size');
    console.log(size);
    if(size < 10){
        size++;
        skipUsers.setAttribute("size",size);
    }
}
function setSkipUsers(users){
    skipUsers.setAttribute("size",2);
    skipUsers.innerHTML = 0;
    users.forEach(function(user){
        addUserToSkipUsers(user);
    });
}

document.getElementById("removeSkipUser").onclick = function(){
    var user = skipUsers.value.trim();
    console.log(user);
    if(user){        
        skipUsersArr.splice(skipUsersArr.indexOf(user),1);
        setSkipUsers(skipUsersArr);
        save_options();
    }
};