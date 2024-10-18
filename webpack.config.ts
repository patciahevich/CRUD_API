import path from "path";
import EslintPlugin from "eslint-webpack-plugin";

const config = {
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [new EslintPlugin({ extensions: "ts" })],
};

export default config;
