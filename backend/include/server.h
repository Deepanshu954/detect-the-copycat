
#ifndef SERVER_H
#define SERVER_H

#include <string>
#include <functional>
#include <vector>
#include <map>

class HttpServer {
public:
    HttpServer(int port);
    ~HttpServer();
    
    void start();
    void stop();
    
    // Define route handler type
    using RequestHandler = std::function<std::string(const std::map<std::string, std::string>&, const std::string&)>;
    
    // Register routes
    void post(const std::string& path, RequestHandler handler);
    void get(const std::string& path, RequestHandler handler);
    
private:
    int port_;
    bool running_;
    void* server_data_; // Implementation-specific data

    std::map<std::string, RequestHandler> post_handlers_;
    std::map<std::string, RequestHandler> get_handlers_;
    
    // CORS headers setup
    std::string set_cors_headers();
};

#endif // SERVER_H
