function sortStringsByRelevance(strings, query) {
    // Normalize query for consistent matching
    const normalizedQuery = query.toLowerCase().trim();
    
    // Helper function to calculate string relevance score
    function getRelevanceScore(str) {
        const normalizedStr = str.toLowerCase();
        
        // Define scoring criteria (higher is more relevant)
        const scores = {
            exactMatch: 100,
            startsWith: 80,
            wordBoundary: 60,
            contains: 40,
            partialMatch: 20
        };
        
        // Calculate score based on match type
        let score = 0;
        
        // Exact match
        if (normalizedStr === normalizedQuery) {
            score = scores.exactMatch;
        }
        // Starts with query
        else if (normalizedStr.startsWith(normalizedQuery)) {
            score = scores.startsWith;
        }
        // Contains query at word boundary
        else if (new RegExp(`\\b${normalizedQuery}`, 'i').test(str)) {
            score = scores.wordBoundary;
        }
        // Contains query anywhere
        else if (normalizedStr.includes(normalizedQuery)) {
            score = scores.contains;
        }
        // Partial word matches
        else {
            // Check for partial matches and count matching characters
            let matchCount = 0;
            let queryIndex = 0;
            
            for (let i = 0; i < normalizedStr.length && queryIndex < normalizedQuery.length; i++) {
                if (normalizedStr[i] === normalizedQuery[queryIndex]) {
                    matchCount++;
                    queryIndex++;
                }
            }
            
            if (matchCount > 0) {
                // Calculate partial match score based on percentage of query matched
                score = scores.partialMatch * (matchCount / normalizedQuery.length);
            }
        }
        
        return score;
    }
    
    // Sort strings based on relevance score
    return strings.sort((a, b) => {
        const scoreA = getRelevanceScore(a);
        const scoreB = getRelevanceScore(b);
        
        // If scores are equal, sort alphabetically
        if (scoreB === scoreA) {
            return a.localeCompare(b);
        }
        
        return scoreB - scoreA;
    });
}

export default sortStringsByRelevance