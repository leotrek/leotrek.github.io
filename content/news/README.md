# News Feed

The homepage and `news.html` both read items from `content/news/news.json`.

## Add a new news item

1. Open `content/news/news.json`.
2. Copy an existing object or the template below.
3. Paste the new object into the array.
4. Change `slug`, `date`, `title`, `summary`, image fields, and article `content`.
5. Commit and publish. No new HTML page is required.

The site sorts items automatically by `date` in descending order, so the newest entry appears first.

## Field guide

- `slug`: unique URL id used for the article view, for example `new-simulator-demo`
- `date`: `YYYY-MM-DD`
- `category`: short label such as `Website`, `Research`, `Product`, or `Company`
- `title`: headline shown on the homepage and news page
- `summary`: short description shown on cards and at the top of the article
- `image`: image path used on cards and the article page
- `image_alt`: alt text for the image
- `article_image_fit`: optional manual override for article image fit, such as `contain` or `cover`
- `article_image_position`: optional manual override for article image position, such as `center center` or `center top`
- `article_image_background`: optional manual override for the article image area background color
- `video_embed_url`: optional HTTPS iframe `src` URL for an embedded video on the article page
- `video_title`: optional iframe title for accessibility, defaults to `<title> video`
- `content`: array of paragraphs for the full article view
- `external_url`: optional link for more detail outside the site
- `external_label`: optional label for the external link, defaults to `Read more`

## Template

Paste this object into `content/news/news.json`:

```json
{
  "slug": "new-orbital-scheduling-paper",
  "date": "2026-07-08",
  "category": "Research",
  "title": "New orbital scheduling paper published",
  "summary": "Short description of the update shown on the homepage.",
  "image": "assets/img/abstract/background.png",
  "image_alt": "Descriptive image text",
  "article_image_fit": "contain",
  "article_image_position": "center center",
  "article_image_background": "#08141b",
  "video_embed_url": "https://example.com/embed/video",
  "video_title": "Embedded video title",
  "content": [
    "First paragraph of the article.",
    "Second paragraph of the article."
  ],
  "external_url": "https://example.com/article",
  "external_label": "Read paper"
}
```

## Notes

- `slug` must stay unique. It becomes the article URL: `news.html?slug=your-slug`
- `content` should be an array of paragraphs, not one long string
- `image` should point to an existing file inside the repo
- By default, the article page now auto-switches wide-crop images to `contain` when needed
- Use `article_image_*` fields only if you want to override that automatic behavior
- Use `video_embed_url` for the iframe `src` value only, not the full `<iframe ...>` HTML
- If you do not need an external link, remove `external_url` and `external_label`
