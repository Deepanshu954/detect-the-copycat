
#ifndef PLAGIARISM_DETECTOR_H
#define PLAGIARISM_DETECTOR_H

#include "text_processing.h"
#include <string>
#include <vector>
#include <set>

class PlagiarismDetector {
public:
    PlagiarismDetector();
    
    // Calculate Jaccard similarity between two sets
    double calculate_jaccard_similarity(const std::set<std::string>& set1, 
                                       const std::set<std::string>& set2) const;
    
    // Compare two texts and return similarity score
    double compare_texts(const std::string& text1, const std::string& text2) const;
    
    // Find common n-grams between two texts
    std::vector<std::string> find_common_ngrams(const std::string& text1, 
                                              const std::string& text2, 
                                              int ngram_size = 3) const;
    
    // Find matching text segments between documents
    std::vector<std::pair<std::string, std::string>> find_matching_segments(
        const std::string& original_text, 
        const std::string& comparison_text) const;
        
    // Find context around a string in text
    std::string find_context(const std::string& text, 
                           const std::string& search,
                           int context_length = 100) const;
    
private:
    TextProcessor text_processor_;
};

#endif // PLAGIARISM_DETECTOR_H
