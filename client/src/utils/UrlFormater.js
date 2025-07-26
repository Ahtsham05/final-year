
const UrlFormater = (url) => {
  return url
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s-]/g, "") // Remove all non-word characters (except spaces and hyphens)
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores, and multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading or trailing hyphens
};
  
  export { UrlFormater };