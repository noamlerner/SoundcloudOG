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
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        skipReposts: true,
        autoScroll: true,
        skipLong: false,
        skipShort: false,
        shorterThan: '30',
        longerThan: '1:0:0'
    }, function(items) {
        Object.keys(items).forEach(function assignVals(key) {
            if (typeof items[key] === 'boolean') {
                document.getElementById(key).checked = items[key];
            } else {
                document.getElementById(key).value = items[key];
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