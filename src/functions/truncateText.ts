function truncateText (text: string, charLimit: number = 100): string {
  if (text.length > charLimit) {
    return text.substring(0, charLimit) + '...'
  } else {
    return text
  }
}

export default truncateText
