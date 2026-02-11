# Images

## Black hole image (`blackhole.jpg`)

The blog article **What Happens at the Edge of a Black Hole** uses the image in this folder. It’s shown in black and white via CSS.

**Right now:** The file is the EHT M87* black hole image (from NRAO).

**To use the Science.org image instead** (Jean-Pierre Luminet’s 1979 visualization from [this article](https://www.science.org/content/article/here-s-what-scientists-think-black-hole-looks)):

1. Open https://www.science.org/content/article/here-s-what-scientists-think-black-hole-looks in your browser.
2. Find the first image in the article (the 1979 hand-drawn black hole).
3. Right‑click the image → **Save image as…**
4. Save it as `blackhole.jpg` in this folder (`static/images/`), replacing the existing file.

The article will then show that image (still in black and white). You can use `blackhole.png` instead if you prefer; in that case, change the `src` in `templates/blog_blackholes.html` to `/static/images/blackhole.png`.

## Homework Machine cover art (`homework_machine_cover.jpg`)

The poem **The Homework Machine** displays cover art at the top of the page.

**To add cover art:**
1. Find or create an image for "The Homework Machine" (could be an illustration of a machine, or artwork inspired by Shel Silverstein's style).
2. Save it as `homework_machine_cover.jpg` (or `.png`) in this folder (`static/images/`).
3. If you use `.png`, update the `src` in `templates/homework_machine.html` to `homework_machine_cover.png`.

Until the file is present, the image will show a broken link placeholder. You can use any image related to the poem theme.
