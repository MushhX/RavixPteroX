import { RavixPlugin } from "../services/plugins.js";
import { examplePlugin } from "./examplePlugin.js";
import { marketplaceStubPlugin } from "./marketplaceStubPlugin.js";

export const builtinPlugins: RavixPlugin[] = [examplePlugin, marketplaceStubPlugin];
