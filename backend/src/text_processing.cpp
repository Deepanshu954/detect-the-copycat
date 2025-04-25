
#include "text_processing.h"
#include <algorithm>
#include <cctype>
#include <regex>
#include <sstream>

TextProcessor::TextProcessor() {
    initialize_stopwords();
}

void TextProcessor::initialize_stopwords() {
    // Common English stopwords
    const std::vector<std::string> stopwords_list = {
        "a", "an", "the", "and", "or", "but", "is", "are", "was", "were", 
        "be", "been", "being", "in", "on", "at", "to", "for", "with", "by", 
        "about", "against", "between", "into", "through", "during", "before", 
        "after", "above", "below", "from", "up", "down", "of", "off", "over", 
        "under", "again", "further", "then", "once", "here", "there", "when", 
        "where", "why", "how", "all", "any", "both", "each", "few", "more", 
        "most", "other", "some", "such", "no", "nor", "not", "only", "own", 
        "same", "so", "than", "too", "very", "i", "me", "my", "myself", "we", 
        "our", "ours", "ourselves", "you", "your", "yours", "yourself", 
        "yourselves", "he", "him", "his", "himself", "she", "her", "hers", 
        "herself", "it", "its", "itself", "they", "them", "their", "theirs", 
        "themselves", "what", "which", "who", "whom", "this", "that", "these", 
        "those", "am", "have", "has", "had", "having", "do", "does", "did", 
        "doing", "would", "should", "could", "ought", "will", "shall", "can", 
        "may", "might", "must", "as", "if", "because", "until", "while"
    };
    
    stopwords_ = std::unordered_set<std::string>(stopwords_list.begin(), stopwords_list.end());
}

std::vector<std::string> TextProcessor::tokenize(const std::string& text) const {
    std::vector<std::string> tokens;
    if (text.empty()) return tokens;
    
    // Convert to lowercase and remove punctuation
    std::string processed_text;
    std::transform(text.begin(), text.end(), std::back_inserter(processed_text),
                   [](unsigned char c) { return std::tolower(c); });
    
    // Remove punctuation and split by whitespace
    std::regex word_regex("[^\\w\\s]");
    processed_text = std::regex_replace(processed_text, word_regex, "");
    
    // Split by whitespace
    std::istringstream iss(processed_text);
    std::string token;
    while (iss >> token) {
        if (!token.empty()) {
            tokens.push_back(token);
        }
    }
    
    return tokens;
}

std::vector<std::string> TextProcessor::remove_stopwords(const std::vector<std::string>& tokens) const {
    std::vector<std::string> filtered;
    filtered.reserve(tokens.size());
    
    for (const auto& token : tokens) {
        if (stopwords_.find(token) == stopwords_.end()) {
            filtered.push_back(token);
        }
    }
    
    return filtered;
}

std::vector<std::string> TextProcessor::create_ngrams(const std::vector<std::string>& tokens, int n) const {
    std::vector<std::string> ngrams;
    if (n <= 0 || tokens.size() < static_cast<size_t>(n)) return ngrams;
    
    ngrams.reserve(tokens.size() - n + 1);
    for (size_t i = 0; i <= tokens.size() - n; ++i) {
        std::ostringstream oss;
        for (size_t j = 0; j < static_cast<size_t>(n); ++j) {
            if (j > 0) oss << ' ';
            oss << tokens[i + j];
        }
        ngrams.push_back(oss.str());
    }
    
    return ngrams;
}

std::vector<std::string> TextProcessor::preprocess_text(const std::string& text, int ngram_size) const {
    auto tokens = tokenize(text);
    auto filtered = remove_stopwords(tokens);
    return create_ngrams(filtered, ngram_size);
}
