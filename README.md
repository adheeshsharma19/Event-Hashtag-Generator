# Event Hashtag Generator

A modern web application that generates SEO-optimized hashtags for various events like birthdays, weddings, anniversaries, college fests, hackathons, and more.

## Features

- Generate hashtags for different types of events
- SEO-optimized hashtag suggestions
- Location and date-specific hashtags
- Trending hashtags based on event type
- One-click copy functionality
- Modern and responsive UI
- Built with Next.js and TypeScript

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Zod (for validation)
- React Hooks

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd hashtag-generator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Select the event type from the dropdown menu
2. Enter the event name
3. (Optional) Add location and date
4. Click "Generate Hashtags"
5. Click on any hashtag to copy it to your clipboard

## API Endpoints

### POST /api/generate

Generates hashtags based on the provided event information.

Request body:
```json
{
  "eventType": "string",
  "eventName": "string",
  "location": "string (optional)",
  "date": "string (optional)"
}
```

Response:
```json
{
  "hashtags": ["string"]
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 