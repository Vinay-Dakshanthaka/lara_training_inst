import DOMPurify from "dompurify";

// cosine similarity
export function cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * (vec2[i] || 0), 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val ** 2, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val ** 2, 0));
    return magnitude1 && magnitude2 ? dotProduct / (magnitude1 * magnitude2) : 0;
  }
  
//    vectorization
//   export function tokenizeAndVectorize(text) {
//     const words = text.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ");
//     const uniqueWords = [...new Set(words)];
//     return uniqueWords.map((word) => words.filter((w) => w === word).length);
//   }

// export function tokenizeAndVectorize(text) {
//     const words = text.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ");
//     const wordCount = {};
    
//     words.forEach(word => {
//       wordCount[word] = (wordCount[word] || 0) + 1;
//     });
  
//     return Object.values(wordCount); 
//   }


// export function tokenizeAndVectorize(text) {
//     // Function to strip HTML tags using DOMParser
//     function stripHtmlTags(html) {
//       const doc = new DOMParser().parseFromString(html, "text/html");
//       return doc.body.textContent || "";
//     }
  
//     const plainText = stripHtmlTags(text); // Convert HTML to plain text
//     const words = plainText.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/);
  
//     const wordCount = {};
//     words.forEach((word) => {
//       if (word) wordCount[word] = (wordCount[word] || 0) + 1;
//     });
  
//     return Object.values(wordCount);
//   }
  

  



export function tokenizeAndVectorize(text) {
    // Function to sanitize and strip HTML tags + inline styles
    function sanitizeAndStripHtml(html) {
      console.log("Original HTML Input:", html);
  
      // Sanitize HTML to remove malicious content
      const cleanHtml = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ["b", "i", "u", "p", "br", "strong", "em"], // Keeps minimal formatting
        ALLOWED_ATTRS: {} // Removes all attributes including inline styles
      });
  
      console.log("Sanitized HTML (Without Inline Styles):", cleanHtml);
  
      // Convert HTML to plain text
      const doc = new DOMParser().parseFromString(cleanHtml, "text/html");
      const plainText = doc.body.textContent || "";
  
      console.log("Extracted Plain Text:", plainText);
      return plainText;
    }
  
    // List of stop words to exclude from tokenization
    const stopWords = new Set([
      "is", "the", "in", "and", "of", "to", "a", "for", "on", "it", "this", "that", "by", "with", "as", "at", "from"
    ]);
  
    const plainText = sanitizeAndStripHtml(text); // Process the input HTML
    const words = plainText
      .toLowerCase()                      // Convert text to lowercase
      .replace(/[^a-z0-9\s]/g, "")        // Remove non-alphanumeric characters except spaces
      .split(/\s+/);                      // Split by one or more whitespace characters
  
    console.log("Tokenized Words (Before Stop Word Removal):", words);
  
    // Filter out stop words from the tokenized words
    const filteredWords = words.filter(word => !stopWords.has(word));
  
    console.log("Filtered Words (No Stop Words):", filteredWords);
  
    // Create a word frequency vector (count the occurrences of each word)
    const wordCount = {};
    filteredWords.forEach((word) => {
      if (word) wordCount[word] = (wordCount[word] || 0) + 1;
    });
  
    console.log("Word Frequency Vector (After Stop Word Removal):", wordCount);
    return Object.values(wordCount);
  }
  
  
