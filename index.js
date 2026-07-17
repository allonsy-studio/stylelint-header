import { existsSync, readFileSync } from "fs";
import { join } from "path";

import stylelint from "stylelint";
import { compareTwoStrings } from "string-similarity";
import { template } from "lodash-es";

const {
	createPlugin,
	utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = "header/header";

const messages = ruleMessages(ruleName, {
	rejected: `Header not found.`,
});

const meta = {
	url: "https://github.com/allonsy-studio/stylelint-header/blob/main/README.md",
};

/**
 * @typedef {object} Options
 * @property {number} [nonMatchingTolerance=0.98] -- percentage of allowed difference between a found comment in the file and the provided header
 * @property {{ [string]: any }} [templateVariables={}] -- used to replace variables in the header template
 * @property {boolean} [isRemovable=false] -- whether the comment starts with `/*!`, a special syntax that is often retained even when other comments are stripped by minifiers such as cssnano
 */

/** @type {import('stylelint').Rule<string, Options>} */
const ruleFunction =
	(pathOrString, options = {}, context = {}) =>
	(root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: pathOrString,
				possible: [
					null,
					(x) => typeof x === "string",
					(x) => typeof x === "string" && existsSync(x),
					(x) => typeof x === "string" && existsSync(join(process.cwd(), x)),
				],
			},
			{
				optional: true,
				actual: options,
				possible: {
					nonMatchingTolerance: [
						(val) => typeof val === "number" && val >= 0 && val <= 1,
					],
					templateVariables: [Object, null],
					isRemovable: [Boolean, null],
				},
			},
		);

		if (!validOptions) return;

		let headerTemplate = pathOrString;

		if (existsSync(pathOrString)) {
			headerTemplate = readFileSync(pathOrString, "utf8");
		} else if (existsSync(join(process.cwd(), pathOrString))) {
			headerTemplate = readFileSync(join(process.cwd(), pathOrString), "utf8");
		}

		if (!headerTemplate || headerTemplate === "") return;

		// Trim any comment tags from the string and remove whitespace
		headerTemplate = headerTemplate.replace(/(\/\*|\*\/|(\s*\*))/g, "").trim();

		const getHeader = template(headerTemplate);
		const header = getHeader({
			YEAR: new Date().getFullYear(),
			FILE_NAME: context.file?.basename,
			FILE_PATH: context.file?.dirname,
			...(options.templateVariables ?? {}),
		});

		const nonMatchingTolerance = options?.nonMatchingTolerance || 0.98;
		const isRemovable = options?.isRemovable || false;

		// Walk comments on root to find if header exists
		let found = false;
		root.walkComments((comment, _idx) => {
			// Remove any asterisks and whitespace from the texts before comparing
			const clean = (text) =>
				text
					.replace(/(\*|\n|\s)/g, "")
					.replace(/^!/g, "")
					.trim();

			// If the two strings are at least 98% alike, it's a match
			if (
				compareTwoStrings(clean(comment.text), clean(header)) >=
				nonMatchingTolerance
			) {
				found = true;
			}

			// This escapes the loop if found, continues if not found
			return !found;
		});

		if (found) return;

		if (context.fix) {
			// Add the provided header to the top of the file
			root.prepend({
				text: header
					.split("\n")
					.map((line) => ` * ${line}`)
					.join("\n"),
				raws: {
					left: isRemovable ? "\n" : "!\n",
					right: "\n ",
				},
			});
			// Put a few newlines between the comment and the first property
			root.nodes[1].raws.before = context.newline + context.newline;
		} else {
			// Just report the issue
			report({
				ruleName: ruleName,
				result: result,
				message: messages.rejected,
				node: root,
			});
		}
	};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
