
cmake_minimum_required(VERSION 3.10)
project(PlagiarismDetection)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find required packages
find_package(CURL REQUIRED)
find_package(nlohmann_json 3.9.1 QUIET)
if(NOT nlohmann_json_FOUND)
  include(FetchContent)
  FetchContent_Declare(json URL https://github.com/nlohmann/json/releases/download/v3.9.1/json.tar.xz)
  FetchContent_MakeAvailable(json)
endif()

# Source files
set(SOURCES
    src/main.cpp
    src/server.cpp
    src/text_processing.cpp
    src/plagiarism_detector.cpp
)

# Include directories
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${CURL_INCLUDE_DIRS}
)

# Create executable
add_executable(plagiarism_server ${SOURCES})

# Link libraries
target_link_libraries(plagiarism_server
    ${CURL_LIBRARIES}
    nlohmann_json::nlohmann_json
)
