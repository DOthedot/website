// Tags every link that leaves the site so Umami records a click on it as an
// "outbound-link" event, with the destination in the event's "url" property.
// Umami's tracker looks for data-umami-event on the clicked element at click
// time, so tagging after load is enough, and new links in templates or
// data/projects.js are covered without remembering to tag them by hand.
// A link that already names its own event (e.g. the contact-form fallback)
// keeps it.
(function () {
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
        var a = links[i];
        if (!/^https?:$/.test(a.protocol) || a.host === location.host) continue;
        if (a.hasAttribute('data-umami-event')) continue;
        a.setAttribute('data-umami-event', 'outbound-link');
        a.setAttribute('data-umami-event-url', a.href);
    }
})();
