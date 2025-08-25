/**
 * Extracts all text content from a given PDF file.
 * @param file The PDF file to process.
 * @returns A promise that resolves with the extracted text as a single string.
 */
export const extractTextFromPdf = async (file: File): Promise<string> => {
  // pdfjsLib is loaded from a script in index.html and its type is declared globally in types.ts
  if (typeof pdfjsLib === 'undefined') {
    throw new Error('pdf.js library is not loaded. Please check the HTML file.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  const numPages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText;
};