## Minifying + in-lining CSS

Run the following command

` gulp --gulpfile gulp-minifier.js`

What it does:
- Minify all `.css` files in the assets folder
- Merge them into a single file
- Read the single file and insert into the `<!-- build:CSS --> <!-- endbuild -->` block in `default.hbs` partial
