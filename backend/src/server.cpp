
#include "server.h"
#include <iostream>
#include <cstring>
#include <thread>
#include <vector>
#include <sstream>
#include <functional>

// This is a simplified implementation using mongoose
// In a production environment, you'd want to use a more robust solution
#include <mongoose.h>

// Structure to store server context
struct ServerContext {
    struct mg_mgr mgr;
    std::map<std::string, HttpServer::RequestHandler>* post_handlers;
    std::map<std::string, HttpServer::RequestHandler>* get_handlers;
    bool running;
};

// Callback function for HTTP events
static void http_handler(struct mg_connection* c, int ev, void* ev_data, void* fn_data) {
    if (ev != MG_EV_HTTP_MSG) return;
    
    auto* server_ctx = static_cast<ServerContext*>(fn_data);
    auto* hm = static_cast<struct mg_http_message*>(ev_data);
    
    // Extract path
    std::string path(hm->uri.ptr, hm->uri.len);
    
    // Check request method
    bool is_post = mg_vcmp(&hm->method, "POST") == 0;
    bool is_get = mg_vcmp(&hm->method, "GET") == 0;
    
    // Handle CORS preflight
    if (mg_vcmp(&hm->method, "OPTIONS") == 0) {
        mg_http_reply(c, 204, 
            "Access-Control-Allow-Origin: *\r\n"
            "Access-Control-Allow-Methods: POST, GET, OPTIONS\r\n"
            "Access-Control-Allow-Headers: Content-Type\r\n"
            "Access-Control-Max-Age: 86400\r\n", 
            "");
        return;
    }
    
    // Find appropriate handler
    HttpServer::RequestHandler* handler = nullptr;
    if (is_post && server_ctx->post_handlers->find(path) != server_ctx->post_handlers->end()) {
        handler = &((*server_ctx->post_handlers)[path]);
    } else if (is_get && server_ctx->get_handlers->find(path) != server_ctx->get_handlers->end()) {
        handler = &((*server_ctx->get_handlers)[path]);
    }
    
    if (handler) {
        // Extract headers
        std::map<std::string, std::string> headers;
        for (int i = 0; i < MG_MAX_HTTP_HEADERS && hm->headers[i].name.len > 0; i++) {
            std::string name(hm->headers[i].name.ptr, hm->headers[i].name.len);
            std::string value(hm->headers[i].value.ptr, hm->headers[i].value.len);
            headers[name] = value;
        }
        
        // Extract body
        std::string body(hm->body.ptr, hm->body.len);
        
        // Call handler
        std::string response = (*handler)(headers, body);
        
        // Send response with CORS headers
        mg_http_reply(c, 200, 
            "Content-Type: application/json\r\n"
            "Access-Control-Allow-Origin: *\r\n", 
            "%s", response.c_str());
    } else {
        // Not found
        mg_http_reply(c, 404, "", "Not found");
    }
}

HttpServer::HttpServer(int port) : port_(port), running_(false), server_data_(nullptr) {}

HttpServer::~HttpServer() {
    stop();
}

void HttpServer::start() {
    if (running_) return;
    
    // Create context
    auto* ctx = new ServerContext;
    server_data_ = ctx;
    
    ctx->post_handlers = &post_handlers_;
    ctx->get_handlers = &get_handlers_;
    ctx->running = true;
    
    // Initialize mongoose
    mg_mgr_init(&ctx->mgr);
    
    // Create HTTP listener
    std::string url = "http://0.0.0.0:" + std::to_string(port_);
    mg_http_listen(&ctx->mgr, url.c_str(), http_handler, ctx);
    
    running_ = true;
    
    // Event loop in a separate thread
    std::thread([this, ctx]() {
        while (ctx->running) {
            mg_mgr_poll(&ctx->mgr, 1000);
        }
        
        mg_mgr_free(&ctx->mgr);
        delete ctx;
    }).detach();
}

void HttpServer::stop() {
    if (!running_) return;
    
    auto* ctx = static_cast<ServerContext*>(server_data_);
    ctx->running = false;
    running_ = false;
}

void HttpServer::post(const std::string& path, RequestHandler handler) {
    post_handlers_[path] = handler;
}

void HttpServer::get(const std::string& path, RequestHandler handler) {
    get_handlers_[path] = handler;
}

std::string HttpServer::set_cors_headers() {
    return "Access-Control-Allow-Origin: *\r\n"
           "Access-Control-Allow-Methods: POST, GET, OPTIONS\r\n"
           "Access-Control-Allow-Headers: Content-Type\r\n";
}
