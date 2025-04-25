
#include "server.h"
#include "plagiarism_detector.h"
#include <nlohmann/json.hpp>
#include <iostream>
#include <string>
#include <map>

using json = nlohmann::json;

int main() {
    const int port = 8080;
    HttpServer server(port);
    PlagiarismDetector detector;
    
    std::cout << "Starting plagiarism detection server on port " << port << std::endl;
    
    // Handle plagiarism detection requests
    server.post("/api/compare", [&detector](
        const std::map<std::string, std::string>& headers, 
        const std::string& body) -> std::string {
        
        try {
            // Parse request
            json request = json::parse(body);
            std::string original_text = request["originalText"];
            std::string comparison_text = request["comparisonText"];
            
            // Process plagiarism detection
            double similarity_score = detector.compare_texts(original_text, comparison_text);
            auto matching_segments = detector.find_matching_segments(original_text, comparison_text);
            
            // Prepare response
            json response;
            response["similarityScore"] = similarity_score;
            
            // Format matching segments
            json segments = json::array();
            for (const auto& segment : matching_segments) {
                json seg;
                seg["original"] = segment.first;
                seg["comparison"] = segment.second;
                segments.push_back(seg);
            }
            response["matchingSegments"] = segments;
            
            return response.dump();
        } catch (const std::exception& e) {
            json error;
            error["error"] = std::string("Error processing request: ") + e.what();
            return error.dump();
        }
    });
    
    // Health check endpoint
    server.get("/api/health", [](
        const std::map<std::string, std::string>& headers, 
        const std::string& body) -> std::string {
        
        json response;
        response["status"] = "ok";
        response["message"] = "Plagiarism detection service is running";
        return response.dump();
    });
    
    // Start the server
    server.start();
    
    return 0;
}
