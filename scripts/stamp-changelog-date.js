/**
 * Stamp release dates into CHANGELOG.md.
 *
 * Changesets hardcodes the `## <version>` release headers and never dates them.
 * This runs immediately after `changeset version` (see the `release:version`
 * script) and appends ` (YYYY-MM-DD)` to every version header that doesn't yet
 * carry a date. Already-dated headers are skipped, so the script is safe to re-run.
 *
 * The date is today's date in UTC, matching the timezone CI publishes in.
 *
 * A version header is `##`–`######` followed by a semver, optionally with a
 * prerelease tag (`## 1.2.0-beta.1`). The prerelease `-` is glued to the patch
 * digit; the date wrapper ` ( ) ` has surrounding spaces, so the two never
 * collide and a dated header fails the `\s*$` anchor and is left untouched.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const CHANGELOG_URL = new URL("../CHANGELOG.md", import.meta.url);
const VERSION_HEADING =
	/^(#{2,6}\s+\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)[ \t]*$/gm;

function stampChangelog(source, date) {
	let stamped = 0;
	const output = source.replace(VERSION_HEADING, (_line, heading) => {
		stamped += 1;
		return `${heading} (${date})`;
	});
	return { output, stamped };
}

function today() {
	return new Date().toISOString().slice(0, 10);
}

function main() {
	const path = fileURLToPath(CHANGELOG_URL);
	const source = readFileSync(path, "utf8");
	const { output, stamped } = stampChangelog(source, today());

	if (stamped === 0) return;
	if (output !== source) writeFileSync(path, output);
}

main();
