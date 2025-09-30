# Xirod Font Files

## Required Font Files

Please add the following Xirod font files to this directory:

1. **Xirod-Regular.woff2** - Web font format (preferred)
2. **Xirod-Regular.woff** - Web font format (fallback)
3. **Xirod-Regular.ttf** - TrueType font format (fallback)

## Font Loading

The font is already configured in `globals.css` with the following features:

- **Font Family**: 'Xirod'
- **Font Display**: swap (for better performance)
- **Fallbacks**: sans-serif
- **Utility Class**: `.font-xirod`

## Usage

The MUTANT logo in the sidebar now uses the Xirod font via the `font-xirod` class.

## File Structure

```
admin-portal/
├── public/
│   └── fonts/
│       ├── Xirod-Regular.woff2  ← Add this file
│       ├── Xirod-Regular.woff   ← Add this file
│       ├── Xirod-Regular.ttf    ← Add this file
│       └── README.md            ← This file
└── src/
    └── app/
        └── globals.css          ← Font already configured
```

## Notes

- The font will automatically load once you add the font files
- If font files are missing, it will fallback to the default sans-serif font
- The font is optimized for web use with proper loading strategies
