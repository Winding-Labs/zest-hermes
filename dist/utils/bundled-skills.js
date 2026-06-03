// src/utils/bundled-skills.ts
import { readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
var BUNDLED_SKILLS_DIR = join(process.env.HERMES_DIR ?? join(homedir(), ".hermes"), "hermes-agent", "skills");
var bundledSkills;
function scanBundledSkills() {
  const names = new Set;
  try {
    const categories = readdirSync(BUNDLED_SKILLS_DIR, { withFileTypes: true });
    for (const cat of categories) {
      if (!cat.isDirectory())
        continue;
      const skills = readdirSync(join(BUNDLED_SKILLS_DIR, cat.name), { withFileTypes: true });
      for (const skill of skills) {
        if (skill.isDirectory())
          names.add(skill.name);
      }
    }
  } catch {}
  return names;
}
function isBundledSkill(name) {
  bundledSkills ??= scanBundledSkills();
  return bundledSkills.has(name);
}
export {
  isBundledSkill
};
