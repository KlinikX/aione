export const formatTextToHtml = (text: string) => {
  // Trim the text to remove leading/trailing whitespace
  const trimmedText = text.trim();

  // Split by double newlines (empty line between paragraphs)
  const paragraphs = trimmedText.split(/\n\s*\n/);

  const formattedParagraphs = paragraphs.map((paragraph) => {
    // Clean up the paragraph
    const cleanParagraph = paragraph.trim();

    // Apply formatting
    let formatted = cleanParagraph;

    // Format inline newlines as <br>
    formatted = formatted.replace(/\n/g, "<br>");

    // Bold, Italics
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Hashtags
    formatted = formatted.replace(
      /(#\w+)/g,
      '<span style="color: #0077B5; font-weight: 600;">$1</span>'
    );

    return `<p style="margin-bottom: 1rem;">${formatted}</p>`;
  });

  return formattedParagraphs.join("");
};
