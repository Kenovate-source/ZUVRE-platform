import React from "react";
import { renderToString } from "react-dom/server";
import { pageFor, Root } from "./routes";
import { writeFileSync } from "node:fs";
writeFileSync(process.argv[2]!, renderToString(<Root>{pageFor(process.argv[3] ?? "/")}</Root>)); // usage: node server-<variant>.cjs <outfile> <path>
