# Fonts

`JetBrainsMonoNerdFont-Regular.ttf` is committed here and served directly by
`@font-face` in `static/css/style.css`.

It is the patched Nerd Font build, though the site currently uses none of the
Nerd Font icon glyphs — plain JetBrains Mono would render every page
identically. If the 2.4MB download ever matters, subsetting this to the
characters the site actually uses and converting to woff2 brings it under
about 40KB:

```sh
pip install fonttools brotli
pyftsubset JetBrainsMonoNerdFont-Regular.ttf \
  --unicodes="U+0000-00FF,U+2013,U+2014,U+2018-201D,U+2026,U+2190,U+2192,U+2714" \
  --flavor=woff2 --output-file=JetBrainsMonoNerdFont-Regular.woff2
```

Then add the woff2 back to the `src` list ahead of the ttf.

Note that the Japanese text on some pages is outside every JetBrains Mono
build, so it falls back to a system font regardless.
