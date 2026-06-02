const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Date filter — uses Luxon format tokens (e.g. 'LLLL dd, yyyy')
  eleventyConfig.addFilter("date", (dateObj, format) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      format || "LLLL dd, yyyy"
    );
  });

  // Current year helper for footer
  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  // Article collection: all .md files under articles/, newest first
  eleventyConfig.addCollection("article", function (collectionApi) {
    return collectionApi.getFilteredByGlob("articles/**/*.md").reverse();
  });

  // Passthrough copy for static assets and GitHub Pages custom domain
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    // Set ELEVENTY_PATH_PREFIX env var when deploying to a GitHub Pages project
    // site (e.g. /helena/). Defaults to "/" for local dev.
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/",
  };
};
