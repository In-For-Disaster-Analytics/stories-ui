# Upstream Viz

A UI to capture and display stories.

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/stories-ui.git
   cd stories-ui
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run lint` - Run linter
- `npm run preview` - Preview production build

## Deployment

The application can be deployed as a static site or using Docker:

```bash
# Build for production
npm run build

# Using Docker
docker build -t stories-ui .
docker run -p 8080:80 stories-ui
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
