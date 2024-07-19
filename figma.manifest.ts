// https://www.figma.com/plugin-docs/manifest/
export default {
  name: "TODO comments",
  "id": "1396225807720172579",
  api: "1.0.0",
  main: "plugin.js",
  ui: "index.html",
  capabilities: [],
  permissions: [
    "currentuser",
    "activeusers",
    "fileusers"
  ],
  enableProposedApi: false,
  editorType: ["figma"],
  documentAccess: "dynamic-page",
  networkAccess: {
    allowedDomains: ["https://*.figma.com", "https://todo-comments.vercel.app"]
  }
};
