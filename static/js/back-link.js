// Blog posts are reachable from the homepage and from /literary. When the
// reader arrives from /literary, send them back there instead of home.
(function () {
    var link = document.getElementById('back-link');
    var text = document.getElementById('back-text');
    if (!link || !text) return;

    if (new URLSearchParams(window.location.search).get('from') === 'literary') {
        link.href = '/literary';
        text.textContent = 'literary works';
    }
})();
