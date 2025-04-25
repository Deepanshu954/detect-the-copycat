
#ifndef TEXT_PROCESSING_H
#define TEXT_PROCESSING_H

#include <string>
#include <vector>
#include <set>
#include <unordered_set>

class TextProcessor {
public:
    TextProcessor();
    
    // Tokenize text into words
    std::vector<std::string> tokenize(const std::string& text) const;
    
    // Remove stopwords
    std::vector<std::string> remove_stopwords(const std::vector<std::string>& tokens) const;
    
    // Create n-grams from tokens
    std::vector<std::string> create_ngrams(const std::vector<std::string>& tokens, int n = 3) const;
    
    // Preprocess text: tokenize, remove stopwords, create n-grams
    std::vector<std::string> preprocess_text(const std::string& text, int ngram_size = 3) const;
    
private:
    std::unordered_set<std::string> stopwords_;
    
    // Initialize stopwords
    void initialize_stopwords();
};

#endif // TEXT_PROCESSING_H
