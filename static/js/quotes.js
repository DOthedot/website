// Roll-a-quote block on the homepage. The die is a button holding nine pips in
// a 3x3 grid; a face is drawn by toggling which pips are visible.
(function () {
    var QUOTES = [
        "The only way to do great work is to love what you do. — Steve Jobs",
        "Imagination is more important than knowledge. — Albert Einstein",
        "The unexamined life is not worth living. — Socrates",
        "We are what we repeatedly do. Excellence, then, is not an act, but a habit. — Aristotle",
        "In the middle of difficulty lies opportunity. — Albert Einstein",
        "The only true wisdom is in knowing you know nothing. — Socrates",
        "Life can only be understood backwards; but it must be lived forwards. — Søren Kierkegaard",
        "I have no special talent. I am only passionately curious. — Albert Einstein",
        "Reality is merely an illusion, albeit a very persistent one. — Albert Einstein",
        "The important thing is not to stop questioning. — Albert Einstein",
        "There is no absolute truth, only relative truth. — Nietzsche",
        "Nobody ever figures out what life is all about, and it doesn't matter. Explore the world. Nearly everything is really interesting if you go into it deeply enough. - Richard Feynman",
        "there is nothing outside of yourself that can ever enable you to get better, stronger, richer, quicker, or smarter. Everything is within. Everything exists. Seek nothing outside of yourself. -Miyamoto Musashi, The Book of Five Rings",
        "Today is victory over yourself of yesterday; tomorrow is your victory over lesser men. -Miyamoto Musashi, The Book of Five Rings",
        "You must understand that there is more than one path to the top of the mountain. -Miyamoto Musashi, The Book of Five Rings"
    ];

    // Pip positions in a 3x3 grid, numbered left-to-right, top-to-bottom.
    var FACES = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] };

    var SPIN_DEGREES = 405;

    // Attribution is glued onto each quote with an inconsistent separator: an
    // em dash, a hyphen, or a hyphen with no space. Anchor on the last dash
    // that follows whitespace so every entry parses, including the ones whose
    // attribution contains a comma.
    function split(raw) {
        var m = /^([\s\S]*\S)\s+[—–-]\s*([^—–]*)$/.exec(raw);
        if (!m) return { text: raw, who: '' };
        return { text: m[1], who: m[2].trim() };
    }

    var textEl = document.getElementById('quote-text');
    var attrEl = document.getElementById('quote-attr');
    var btn = document.getElementById('dice-btn');
    if (!textEl || !attrEl || !btn) return;

    var pips = [];
    for (var i = 0; i < 9; i++) {
        var pip = document.createElement('span');
        pip.className = 'dice-pip';
        btn.appendChild(pip);
        pips.push(pip);
    }

    function showFace(n) {
        var on = FACES[n];
        for (var i = 0; i < 9; i++) {
            pips[i].classList.toggle('on', on.indexOf(i + 1) !== -1);
        }
    }

    var previous = null;
    var spin = 0;

    function roll() {
        var quote;
        do {
            quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        } while (quote === previous && QUOTES.length > 1);
        previous = quote;

        var parts = split(quote);
        textEl.textContent = parts.text;
        attrEl.textContent = parts.who ? '— ' + parts.who : '';
        showFace(Math.floor(Math.random() * 6) + 1);
    }

    roll();

    btn.addEventListener('click', function () {
        // Accumulate rather than reset: rotating to the same angle twice would
        // produce no transition on the second click.
        spin += SPIN_DEGREES;
        btn.style.transform = 'rotate(' + spin + 'deg)';
        roll();
    });
})();
