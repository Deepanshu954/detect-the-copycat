
# Project Structure

```
plagiarism-detection-system/
│
├── README.md                  # Project documentation
├── launch.sh                  # Script to launch both frontend and backend
├── project_structure.md       # This file
│
├── backend/                   # C++ Backend
│   ├── CMakeLists.txt         # CMake build configuration
│   ├── README.md              # Backend-specific documentation
│   │
│   ├── include/               # Header files
│   │   ├── server.h           # HTTP server interface
│   │   ├── text_processing.h  # Text processing utilities
│   │   └── plagiarism_detector.h # Plagiarism detection algorithms
│   │
│   └── src/                   # Source files
│       ├── main.cpp           # Application entry point
│       ├── server.cpp         # HTTP server implementation
│       ├── text_processing.cpp # Text processing implementation
│       └── plagiarism_detector.cpp # Plagiarism detection implementation
│
└── frontend/                  # React/TypeScript Frontend
    ├── package.json           # NPM configuration
    ├── tsconfig.json          # TypeScript configuration
    │
    ├── public/                # Static files
    │   └── favicon.ico        # Favicon
    │
    └── src/                   # Source code
        ├── main.tsx           # Application entry point
        ├── App.tsx            # Main React component
        ├── index.css          # Global styles
        │
        ├── components/        # UI components
        │   ├── Header.tsx     # Page header
        │   ├── FileUpload.tsx # File upload component
        │   ├── ComparisonResults.tsx # Results display
        │   ├── TextPreview.tsx # Text preview component
        │   └── ui/            # UI library components
        │
        ├── pages/             # Page components
        │   ├── Index.tsx      # Main page
        │   └── NotFound.tsx   # 404 page
        │
        ├── utils/             # Utility functions
        │   ├── apiClient.ts   # Backend API client
        │   ├── plagiarismUtils.ts # Fallback plagiarism detection
        │   └── textProcessing.ts # Text processing utilities
        │
        ├── lib/               # Library code
        │   └── utils.ts       # Utility functions
        │
        └── hooks/             # React hooks
            └── use-toast.ts   # Toast notification hook
```
