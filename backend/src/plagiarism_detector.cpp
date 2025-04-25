
#include "plagiarism_detector.h"
#include <algorithm>
#include <set>
#include <cmath>

PlagiarismDetector::PlagiarismDetector() : text_processor_() {}

double PlagiarismDetector::calculate_jaccard_similarity(
    const std::set<std::string>& set1,
    const std::set<std::string>& set2
) const {
    if (set1.empty() && set2.empty()) return 0.0;
    
    // Count intersection
    size_t intersection_size = 0;
    for (const auto& item : set1) {
        if (set2.find(item) != set2.end()) {
            intersection_size++;
        }
    }
    
    // Calculate union size (A + B - intersection)
    size_t union_size = set1.size() + set2.size() - intersection_size;
    
    // Return Jaccard similarity
    return static_cast<double>(intersection_size) / static_cast<double>(union_size);
}

double PlagiarismDetector::compare_texts(const std::string& text1, const std::string& text2) const {
    // Process texts to n-grams
    auto ngrams1 = text_processor_.preprocess_text(text1);
    auto ngrams2 = text_processor_.preprocess_text(text2);
    
    // Convert to sets for Jaccard similarity calculation
    std::set<std::string> set1(ngrams1.begin(), ngrams1.end());
    std::set<std::string> set2(ngrams2.begin(), ngrams2.end());
    
    // Calculate and return similarity
    return calculate_jaccard_similarity(set1, set2);
}

std::vector<std::string> PlagiarismDetector::find_common_ngrams(
    const std::string& text1,
    const std::string& text2,
    int ngram_size
) const {
    // Process texts to n-grams
    auto ngrams1 = text_processor_.preprocess_text(text1, ngram_size);
    auto ngrams2 = text_processor_.preprocess_text(text2, ngram_size);
    
    // Find common n-grams
    std::set<std::string> set1(ngrams1.begin(), ngrams1.end());
    std::set<std::string> set2(ngrams2.begin(), ngrams2.end());
    
    std::vector<std::string> common_ngrams;
    for (const auto& ngram : set1) {
        if (set2.find(ngram) != set2.end()) {
            common_ngrams.push_back(ngram);
        }
    }
    
    return common_ngrams;
}

std::string PlagiarismDetector::find_context(
    const std::string& text,
    const std::string& search,
    int context_length
) const {
    // Convert to lowercase for case-insensitive search
    std::string lower_text = text;
    std::string lower_search = search;
    
    std::transform(lower_text.begin(), lower_text.end(), lower_text.begin(),
                  [](unsigned char c) { return std::tolower(c); });
    std::transform(lower_search.begin(), lower_search.end(), lower_search.begin(),
                  [](unsigned char c) { return std::tolower(c); });
    
    // Find the phrase in the text
    size_t index = lower_text.find(lower_search);
    if (index == std::string::npos) return "";
    
    // Extract context
    size_t start = (index > static_cast<size_t>(context_length / 2)) ? 
                   index - context_length / 2 : 0;
    size_t end = std::min(text.length(), index + search.length() + context_length / 2);
    
    return text.substr(start, end - start);
}

std::vector<std::pair<std::string, std::string>> PlagiarismDetector::find_matching_segments(
    const std::string& original_text,
    const std::string& comparison_text
) const {
    // Find common n-grams (using a larger n-gram size for better context)
    std::vector<std::string> common_ngrams = find_common_ngrams(original_text, comparison_text, 4);
    
    // Create matches with context
    std::vector<std::pair<std::string, std::string>> matches;
    
    // Limit to reasonable number of matches
    const size_t max_matches = std::min(static_cast<size_t>(5), common_ngrams.size());
    
    for (size_t i = 0; i < max_matches; ++i) {
        const auto& ngram = common_ngrams[i];
        std::string original_context = find_context(original_text, ngram);
        std::string comparison_context = find_context(comparison_text, ngram);
        
        if (!original_context.empty() && !comparison_context.empty()) {
            matches.push_back({original_context, comparison_context});
        }
    }
    
    return matches;
}
