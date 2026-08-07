import fs from "node:fs";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "_restart": "." });
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "css": "css" });
  eleventyConfig.addPassthroughCopy({ "js": "js" });
  eleventyConfig.addPassthroughCopy({ "hii-film-1080p.mp4": "hii-film-1080p.mp4" });
  eleventyConfig.addPassthroughCopy({ "hii-film-720p.mp4": "hii-film-720p.mp4" });
  eleventyConfig.addPassthroughCopy({ "hii-film-poster.jpg": "hii-film-poster.jpg" });
  eleventyConfig.addPassthroughCopy({ "assets_hii-frontpage.png": "assets_hii-frontpage.png" });
  eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "humans.txt": "humans.txt" });
  eleventyConfig.addPassthroughCopy({ "_headers": "_headers" });

  for (const filename of fs.readdirSync(".").filter((name) => name.endsWith(".html"))) {
    if (filename !== "index.html" && filename !== "motion-test.html") {
      eleventyConfig.addPassthroughCopy({ [filename]: filename });
    }
  }

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
