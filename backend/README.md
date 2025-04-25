
# Plagiarism Detection System - Backend

This is the C++ backend for the plagiarism detection system. It processes text documents and computes similarity scores using advanced algorithms.

## Features

- Text preprocessing (tokenization, stopword removal)
- N-gram generation for text comparison
- Jaccard similarity computation
- Identification of matching text segments

## Building and Running

### Prerequisites

- C++ compiler with C++17 support
- CMake 3.10 or higher
- libcurl for HTTP requests
- nlohmann/json for JSON parsing

### Build Instructions

```bash
mkdir build
cd build
cmake ..
make
```

### Running the Server

```bash
./plagiarism_server
```

The server runs on port 8080 by default.
