import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

import { getTestRule, getTestRuleConfigs } from "jest-preset-stylelint";

import myPlugin from "../index.js";

const plugins = [myPlugin];

global.testRule = getTestRule({ plugins });
global.testRuleConfigs = getTestRuleConfigs({ plugins });

const {
	ruleName,
	rule: { messages },
} = myPlugin;

/** @description Test case with input file URL */
testRule({
	plugins,
	ruleName,
	config: [
		join("test", "input.txt"),
		{
			nonMatchingTolerance: 1,
			templateVariables: {
				company: "AI Overlords Inc.",
			},
		},
	],
	fix: true,

	accept: [
		{
			code: readFileSync(join("test", "pass.css"), { encoding: "utf-8" }),
			description: "Simple CSS with header included",
		},
	],

	reject: [
		{
			code: readFileSync(join("test", "fail.css"), { encoding: "utf-8" }),
			fixed: readFileSync(join("test", "fixed.css"), { encoding: "utf-8" }),
			description: "Auto-fix file missing header",
			message: messages.rejected,
		},
	],
});

/** @description Test case with input template string */
testRule({
	plugins,
	ruleName,
	config: [
		"Copyright <%= YEAR %> <%= company %>",
		{
			nonMatchingTolerance: 1,
			templateVariables: {
				company: "AI Overlords Inc.",
			},
		},
	],

	accept: [
		{
			code: readFileSync(join("test", "pass.css"), { encoding: "utf-8" }),
			description: "Simple CSS with header included",
		},
	],

	reject: [
		{
			code: readFileSync(join("test", "fail.css"), { encoding: "utf-8" }),
			description: "Error if missing header",
			message: messages.rejected,
		},
	],
});

/** @description Test case with multi-line header in input file */
testRule({
	plugins,
	ruleName,
	config: [join(__dirname, "../COPYRIGHT")],

	accept: [
		{
			code: readFileSync(join("test", "multi-line.css"), { encoding: "utf-8" }),
			description: "Simple CSS with multi-line header",
		},
	],

	reject: [
		{
			code: readFileSync(join("test", "fail.css"), { encoding: "utf-8" }),
			description: "Error if missing header",
			message: messages.rejected,
		},
	],
});

/** @description Test case with disabled rule (should not run) */
testRule({
	plugins,
	ruleName,
	config: null,
	accept: [
		{
			description: "Rule disabled",
			code: readFileSync(join("test", "fail.css"), { encoding: "utf-8" }),
		},
	],
});

/** @description Test case with invalid input */
testRule({
	plugins,
	ruleName,
	config: true,
	reject: [
		{
			description: "Invalid inputs",
			message: 'Invalid option value "true" for rule "header/header"',
			code: readFileSync(join("test", "fail.css"), { encoding: "utf-8" }),
		},
	],
});

/** @description Test case with invalid input for nonMatchingTolerance */
testRule({
	plugins,
	ruleName,
	config: [
		"Copyright <%= YEAR %> AI Overlords Inc.",
		{ nonMatchingTolerance: 10 },
	],
	reject: [
		{
			description: "Invalid input for nonMatchingTolerance",
			message:
				'Invalid value "10" for option "nonMatchingTolerance" of rule "header/header"',
			code: readFileSync(join("test", "fail.css"), { encoding: "utf-8" }),
		},
	],
});

/** @description Test case to validate removable tests */
testRule({
	plugins,
	ruleName,
	config: [
		join("test", "input.txt"),
		{
			nonMatchingTolerance: 1,
			templateVariables: {
				company: "AI Overlords Inc.",
			},
			isRemovable: true,
		},
	],
	fix: true,

	accept: [
		{
			code: readFileSync(join("test", "pass-removable.css"), {
				encoding: "utf-8",
			}),
			description: "Simple CSS with header included in a removable comment",
		},
	],

	reject: [
		{
			code: readFileSync(join("test", "fail.css"), { encoding: "utf-8" }),
			fixed: readFileSync(join("test", "fixed-removable.css"), {
				encoding: "utf-8",
			}),
			description: "Auto-fix file missing header with removable comment",
			message: messages.rejected,
		},
	],
});

/** @description Test cases for the built-in file variables */
testRule({
	plugins,
	ruleName,
	config: ["File: <%= FILE_NAME %> in <%= FILE_PATH %>"],
	fix: true,

	reject: [
		{
			description: "FILE_NAME and FILE_PATH resolve from the file location",
			code: ".foo {\n\tposition: relative;\n}\n",
			codeFilename: join(process.cwd(), "test", "nested", "a.css"),
			fixed:
				"/*!\n * File: a.css in test/nested\n */\n\n.foo {\n\tposition: relative;\n}\n",
			message: messages.rejected,
		},
		{
			description: "FILE_PATH is . for a file in the working directory",
			code: ".foo {\n\tposition: relative;\n}\n",
			codeFilename: join(process.cwd(), "a.css"),
			fixed:
				"/*!\n * File: a.css in .\n */\n\n.foo {\n\tposition: relative;\n}\n",
			message: messages.rejected,
		},
	],
});

/** @description Test case for linting code without a file name */
testRule({
	plugins,
	ruleName,
	config: ["File: [<%= FILE_NAME %>] [<%= FILE_PATH %>]"],
	fix: true,

	reject: [
		{
			description: "FILE_NAME and FILE_PATH are empty without a file",
			code: ".foo {\n\tposition: relative;\n}\n",
			fixed: "/*!\n * File: [] []\n */\n\n.foo {\n\tposition: relative;\n}\n",
			message: messages.rejected,
		},
	],
});
