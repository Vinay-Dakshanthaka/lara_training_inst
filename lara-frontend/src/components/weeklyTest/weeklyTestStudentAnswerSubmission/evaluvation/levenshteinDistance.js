// export const getLevenshteinDistance = (a, b) => {
//   const temp = [];
//   for (let i = 0; i <= a.length; i++) {
//     temp[i] = [i];
//   }
//   for (let j = 0; j <= b.length; j++) {
//     temp[0][j] = j;
//   }
//   for (let i = 1; i <= a.length; i++) {
//     for (let j = 1; j <= b.length; j++) {
//       const cost = a[i - 1] === b[j - 1] ? 0 : 1;
//       temp[i][j] = Math.min(
//         temp[i - 1][j] + 1, // Deletion
//         temp[i][j - 1] + 1, // Insertion
//         temp[i - 1][j - 1] + cost // Substitution
//       );
//     }
//   }
//   const maxLength = Math.max(a.length, b.length);
//   return (1 - temp[a.length][b.length] / maxLength).toFixed(2); // Return similarity as a percentage
// };


const stopWords = new Set([
    "is", "the", "a", "an", "and", "or", "to", "in", "on", "at", "of", "for", "with", "as", "by", "this", "that", "it", "which", "whose", "who", "where", "how", "can", "could", "may", "should", "might", "do", "does", "did", "are", "were", "be", "been", "being"
  ]);
  
  const cleanText = (text) => {
    return text
      .toLowerCase()
      .split(/\s+/) 
      .filter(word => !stopWords.has(word)) 
      .sort() 
      .join(" "); 
  };
  
  export const getImprovedLevenshteinDistance = (a, b) => {
    const cleanedA = cleanText(a);
    const cleanedB = cleanText(b);
  
    const wordsA = cleanedA.split(" ");
    const wordsB = cleanedB.split(" ");
  
    const matchingWords = wordsA.filter(wordA => wordsB.includes(wordA)).length;
  
    const levenshteinDistance = (word1, word2) => {
      const temp = [];
      for (let i = 0; i <= word1.length; i++) {
        temp[i] = [i];
      }
      for (let j = 0; j <= word2.length; j++) {
        temp[0][j] = j;
      }
      for (let i = 1; i <= word1.length; i++) {
        for (let j = 1; j <= word2.length; j++) {
          const cost = word1[i - 1] === word2[j - 1] ? 0 : 1;
          temp[i][j] = Math.min(
            temp[i - 1][j] + 1, // Deletion
            temp[i][j - 1] + 1, // Insertion
            temp[i - 1][j - 1] + cost // Substitution
          );
        }
      }
      const maxLength = Math.max(word1.length, word2.length);
      return (1 - temp[word1.length][word2.length] / maxLength); 
    };
  
    const wordSimilarityPercentage = (matchingWords / Math.max(wordsA.length, wordsB.length)) * 100;
  
    const levenshteinSimilarityPercentage = levenshteinDistance(cleanedA, cleanedB) * 100;
  
    return {
      wordSimilarityPercentage: wordSimilarityPercentage.toFixed(2), 
      levenshteinSimilarityPercentage: (levenshteinSimilarityPercentage).toFixed(2) 
    };
  };
  