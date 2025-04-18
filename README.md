# Unity AI Script Generator


https://github.com/user-attachments/assets/bebeae0e-61f2-4a9d-819a-b049f1e1d4d6


![image](https://github.com/user-attachments/assets/d6b54e2c-5659-4fd8-9824-8399dd082826?width=400)
![image](https://github.com/user-attachments/assets/abc2fdfb-f388-4c59-9229-b5f0452fbb74?width=400)

A desktop application that leverages AI (ChatGPT) to generate and save Unity C# scripts directly to
 your Unity project.

## Architecture & Design

### Technology Stack

- **Tauri**
- **React**
- **Shadcn**: UI components
- **TailwindCSS**: styles
- **TypeScript**
- **ChatGPT API**

### Key Design Decisions

#### Tauri vs Electron

Tauri was chosen over Electron for its significantly smaller bundle size and better performance characteristics. Additionally, having already some experience with with Electron development I wanted to try Tauri for this project :)

#### Native File System Integration

Using Tauri's Rust backend for direct integration with the Unity project filesystem. This allows scripts to be saved without requiring manual copy/paste operations.

#### Modular Component Architecture

The application follows a component-based architecture to promote maintainability:

- **ChatDisplay**: Manages the conversation view
- **ChatInput**: Handles user input and submission
- **ProjectPathButton**: Connects to the Unity project directory (user manualy selects path)

#### State Management

We use React's useState and local storage for state management.

### AI Generated code

Code assisted or generated code:

- Rust code fo Tauri
- C# prompy template
- Shadcn components `src/components/ui`
- `src/utils`

### Trade-offs

1. **Limited to Text Generation**: The application currently only supports C# script generation.

2. **Local Storage for Unity Path**: For simplicity, we store the Unity project path in localStorage.

3. **Single Script Generation**: Currently, each generated script is saved individually rather than supporting multi-script generation or project templates.

4. **No real-time sync and No hot-reload**: user need Unity to recompile and refresh project to see script results

## Setup Instructions

### Prerequisites

- Node.js 16 or higher
- Rust (for Tauri)
- Unity project (local)

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd unity-ai-script-generator
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create .env file in the root of the project and ChatGPT API key to it:

   ```bash
   //.env
   VITE_OPENAI_API_KEY=<API_KEY>
   ```

4. Run in development mode:

   ```bash
   npm run tauri dev
   ```

5. Build for production:

   ```bash
   npm run tauri build
   ```

## Testing

### Setup

This project uses Jest and React Testing Library for component testing.

### Running Tests

To run the tests once:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

### Testing Structure

- Tests are located in `src/__tests__` directory
- Test files should follow the naming convention: `*.test.tsx` or `*.test.ts`
- Setup configuration is in `src/setupTests.ts`
- Jest configuration is in `jest.config.ts`

## Using the Application

1. Launch the application
2. Select your Unity project folder using the button with open folder icon
3. Describe the script you want to create (e.g., "Create green sphere with red square next to it")
4. Review the generated C# code
5. Click "Save to Unity" to save the script to your project

## Limitations & Considerations

- **API Key Management**: ChatGPT API key has to be provided in
- **Unity Version Compatibility**: Developed with Unity v6

## License

[MIT License](LICENSE)
