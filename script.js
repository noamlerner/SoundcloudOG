var skipButton = document.getElementsByClassName("skipControl playControls__icon sc-ir skipControl__next")[0];
var skip = [];
var options;

function ensureSongLength(playback) {
    var container = playback.getElementsByClassName('playbackTimeline__duration')[0];
    var lengthString = container.getElementsByTagName('span')[1].innerHTML;
    var length = lengthString.split(':').reverse();
    var ensureOrdering = function(less, more) {
        var ordered = true;
        if (less.length > more.length) {
            return false;
        }
        if (less.length < more.length) {
            return true;
        }
        for (var i = 0; i < less.length; i++) {
            var lt = parseInt(less[i]);
            var mt = parseInt(more[i]);
            if (!isNaN(lt) && !isNaN(mt)) {
                if (lt !== mt) {
                    ordered = lt < mt
                }
            } else {
                // incorrect input
                return true;
            }
        }
        return ordered;
    }
    var skip = false;
    if (options.skipShort) {
        skip = !ensureOrdering(options.shorterThan, length);
    }
    if (!skip && options.skipLong) {
        skip = !ensureOrdering(length, options.longerThan);
    }
    return skip;
}
// scrolling stuff
var scrollingTimeout, iScrolled = false,
    scrolling = true;

function scrollEvent() {
    if (options.autoScroll) {
        document.addEventListener('scroll', function() {
            if (!iScrolled) {
                clearTimeout(scrollingTimeout);
                scrolling = false;
                scrollingTimeout = setTimeout(function() {
                    scrolling = true;
                }, 30000)
            } else {
                iScrolled = false;
            }
        });
    }
}

function handleScroll() {
    if (options.autoScroll && scrolling) {
        window.scrollBy(0, 1000);
        iScrolled = true;
    }
    document.execCommand('scroll');
}

function repeat() {
    var posts = document.getElementsByClassName('soundList__item');
    if (posts.length < 5 && options.autoScroll && scrolling) {
        window.scrollBy(0, 1000);
        iScrolled = true;
    }
    for (var i = 0; i < posts.length; i++) {
        if (options.skipReposts && posts[i].innerHTML.indexOf('Reposted') !== -1) {
            skip.push(posts[i].getElementsByClassName("soundTitle__title")[0].getElementsByTagName('span')[0].innerHTML);
            posts[i].parentNode.removeChild(posts[i]);
        }
    }
    var playback = document.getElementsByClassName("playControls g-z-index-header m-visible")[0];
    if (playback !== undefined) {
        handleScroll();
        var curSongHolder = playback.getElementsByTagName('a')[2];
        var skipLength = false;
        if ((options.skipShort || options.skipLong) && ensureSongLength(playback)) {
            skipSong();
            return;
        }
        var title = curSongHolder.getAttribute('title');
        for (var i = 0; i < skip.length; i++) {
            if (skip[i] === title) {
                skipSong();
                return;
            }
        }
    }
    setTimeout(repeat, 1000);
}

function skipSong() {
    console.log('Song Skip');
    skipButton.click();
    setTimeout(repeat, 300);
}

chrome.storage.sync.get({
    skipReposts: true,
    skipLong: false,
    skipShort: false,
    autoScroll: true,
    shorterThan: '30',
    longerThan: '1:0:0'
}, function(items) {
    options = items;
    options.shorterThan = options.shorterThan.split(':').reverse();
    options.longerThan = options.longerThan.split(':').reverse();
    repeat();
    scrollEvent();
});