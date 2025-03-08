# Modern Blog Website

A responsive and modern blog website designed for sharing blog posts, data analyses, and stock market insights. The website features a clean, professional design with excellent readability and user experience.

## Features

- Responsive design that works on all devices
- Modern and clean user interface
- Category-based post organization
- Search functionality
- Newsletter subscription
- Comments system
- Social media sharing
- Reading time estimation
- Related posts suggestions

## Structure

```
WebSitesi/
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── main.js            # Core JavaScript functionality
│   └── blog.js            # Blog-specific functionality
├── images/                # Store all images here
├── posts/                 # Individual blog post pages
├── index.html            # Homepage
├── blog.html             # Blog listing page
└── README.md             # This file
```

## How to Modify

### Adding a New Blog Post

1. Create a new HTML file in the `posts` directory
2. Copy the structure from an existing post (e.g., `stock-market-trends-2025.html`)
3. Update the content, including:
   - Title
   - Meta information (date, read time)
   - Content
   - Images
   - Tags
   - Related posts

### Modifying Styles

The `style.css` file contains all styling information. Key sections are:

- Variables (colors, spacing, etc.) at the top
- Typography styles
- Layout components
- Responsive design rules

### Adding New Features

The JavaScript files are modular and well-commented:

- `main.js`: Core functionality (navigation, forms, etc.)
- `blog.js`: Blog-specific features (filtering, search, etc.)

## Best Practices

1. Always compress images before adding them to the `images` directory
2. Keep the HTML structure consistent across pages
3. Use semantic HTML tags for better SEO
4. Test any changes across different devices and browsers

## Customization

### Colors

You can easily change the color scheme by modifying the CSS variables in `style.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --text-color: #1f2937;
    /* ... other colors ... */
}
```

### Typography

The website uses Poppins as its primary font. To change this:

1. Update the Google Fonts link in the HTML files
2. Modify the font-family in `style.css`

### Layout

The main layout uses CSS Grid and Flexbox. Key components:

- `.container`: Controls the maximum width of content
- `.posts-grid`: Manages the blog post card layout
- `.categories-grid`: Controls the categories section layout

## Development

To run the website locally:

1. Simply open `index.html` in a web browser
2. For best results, use a local server (e.g., Live Server in VS Code)

## Adding New Features

The website is built to be easily extensible. Common additions might include:

1. Search functionality with filters
2. User authentication
3. Comments system integration
4. Analytics integration
5. Social media feeds

## Browser Support

The website is tested and works on:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

The website is optimized for performance with:

- Lazy loading images
- Minified CSS and JavaScript
- Optimized font loading
- Responsive images

## SEO

The website includes basic SEO best practices:

- Semantic HTML structure
- Meta descriptions
- Clean URLs
- Mobile-friendly design
- Fast loading times

## Need Help?

The code is thoroughly commented to help you understand and modify it. If you need to make changes:

1. Locate the relevant section in the code
2. Read the comments for guidance
3. Make small changes and test
4. Always backup before making major changes
