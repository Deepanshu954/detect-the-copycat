
# Plagiarism Detection System

A comprehensive system for detecting plagiarism between text documents with precise similarity analysis and visualization.

## Project Structure

The project is divided into two main parts:

### Frontend (React/TypeScript/Vite)
- Modern UI for document upload and comparison
- Real-time similarity visualization with detailed metrics
- Highlighting of matching text segments

### Backend (C++)
- High-performance text processing engine
- Implementation of advanced similarity algorithms
- RESTful API for text comparison services

## Technical Approach

### Text Processing
1. **Tokenization**: Converting text into individual tokens (words)
2. **Stopword Removal**: Filtering common words like "the", "and", etc.
3. **N-gram Generation**: Creating sequences of n consecutive words

### Similarity Detection
1. **Jaccard Similarity**: Measuring the intersection over union of n-grams
2. **Text Segment Matching**: Identifying specific matching passages
3. **Context Analysis**: Providing surrounding context for matched segments

### Performance Optimization
- Efficient data structures for text representation
- Optimized C++ algorithms for large document processing
- Strategic caching of intermediate results

## Getting Started

### Prerequisites
- Node.js 14+ and npm
- C++17 compatible compiler
- CMake 3.10+
- libcurl development libraries

### Running the Application

The easiest way to run the application is using the provided launch script:

```bash
chmod +x launch.sh
./launch.sh
```

This script will:
1. Build and start the C++ backend server
2. Install dependencies and start the React frontend
3. Provide URLs to access each component

### Manual Setup

#### Backend
```bash
cd backend
mkdir build && cd build
cmake ..
make
./plagiarism_server
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Usage

1. Navigate to the frontend URL (default: http://localhost:5173)
2. Upload or paste text documents for comparison
3. Click "Compare Texts" to analyze
4. View the similarity score and matching segments
5. Explore detailed analysis of potential plagiarism

## API Endpoints

- `POST /api/compare`: Compare two text documents
  - Request body: `{ "originalText": "...", "comparisonText": "..." }`
  - Response: `{ "similarityScore": 0.75, "matchingSegments": [...] }`

- `GET /api/health`: Check if the service is running
  - Response: `{ "status": "ok", "message": "..." }`
