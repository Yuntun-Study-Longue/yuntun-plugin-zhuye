import path from "path";

export const REACT_APP_ROOT = process.env.REACT_APP_ROOT || "/zhuye";
const ABSOLUTE_BASE = path.normalize(path.join(__dirname, "."));

const constants = Object.freeze({
  REACT_APP_ROOT,
  ABSOLUTE_BASE,
  NODE_MODULES_DIR: path.join(ABSOLUTE_BASE, "node_modules"),
  BUILD_DIR: path.join(ABSOLUTE_BASE, "build"),
  DIST_DIR: path.join(ABSOLUTE_BASE, "dist"),
  SRC_DIR: path.join(ABSOLUTE_BASE, "src"),
  ASSETS_DIR: path.join(ABSOLUTE_BASE, "assets")
});

export default constants;
