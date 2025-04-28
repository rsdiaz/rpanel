// Generated using "pnpm build-templates"

import { meta as meta_adminer } from "./adminer/meta";
import { generate as generate_adminer } from "./adminer";
import { meta as meta_appwrite } from "./appwrite/meta";
import { generate as generate_appwrite } from "./appwrite";

const templates = [
  { slug: "adminer", meta: meta_adminer, generate: generate_adminer },
  { slug: "appwrite", meta: meta_appwrite, generate: generate_appwrite },
];

export default templates;
