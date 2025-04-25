
#!/bin/bash

# Launch script for Plagiarism Detection System

echo "==== Plagiarism Detection System Launcher ===="
echo "Starting frontend and backend services..."

# Start the backend build and server
echo "Building and starting C++ backend..."
cd backend
mkdir -p build
cd build
cmake ..
make -j4
./plagiarism_server &
BACKEND_PID=$!
cd ../..

# Start the frontend development server
echo "Starting frontend Vite development server..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Services started!"
echo "Frontend running at http://localhost:5173"
echo "Backend API running at http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop all services"

# Handle cleanup on script exit
trap 'echo "Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT TERM

# Keep the script running
wait
