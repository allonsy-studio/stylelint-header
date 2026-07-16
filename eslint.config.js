import { defineConfig } from "eslint/config";
import globals from "globals";

import js from "@eslint/js";
import jest from "eslint-plugin-jest";
import json from "@eslint/json";
import jsonc from "eslint-plugin-jsonc";
import markdown from "@eslint/markdown";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
	{
		ignores: ["**/node_modules/**", ".yarn/**", ".cache/**"],
	},
	{
		files: ["**/*.js"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: {
			sourceType: "module",
			globals: globals.node,
		},
		rules: {
			eqeqeq: ["error", "smart"],
			"no-var": "error",
			"prefer-const": "error",
			"no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrors: "none",
				},
			],
			// Logs should be written through @actions/core & fails via
			// core.setFailed — never the raw console or a hard process exit.
			"no-console": "error",
			"no-process-exit": "error",
			// Don't let unfinished markers ride along into a published action.
			"no-warning-comments": [
				"warn",
				{ terms: ["todo", "fixme", "xxx"], location: "anywhere" },
			],
		},
	},
	{
		files: ["**/*.test.js"],
		plugins: { jest },
		extends: ["jest/recommended"],
		languageOptions: {
			globals: jest.environments.globals.globals,
		},
	},
	{
		// All JSON except package.json, which has its own jsonc block below.
		files: ["**/*.json"],
		ignores: ["**/package.json"],
		plugins: { json },
		language: "json/json",
		extends: ["json/recommended"],
		rules: {
			"json/sort-keys": [
				"warn",
				"asc",
				{
					natural: true,
				},
			],
		},
	},
	{
		files: ["package.json"],
		plugins: { jsonc },
		language: "jsonc/jsonc",
		extends: ["jsonc/recommended-with-json"],
		rules: {
			"jsonc/sort-keys": [
				"warn",
				{
					pathPattern: "^$",
					order: [
						"$schema",
						"private",
						"publishConfig",
						"name",
						"version",
						"description",
						"license",
						"author",
						"maintainers",
						"contributors",
						"homepage",
						"funding",
						"repository",
						"bugs",
						"type",
						"exports",
						"main",
						"module",
						"browser",
						"man",
						"preferGlobal",
						"bin",
						"files",
						"directories",
						"scripts",
						"config",
						"sideEffects",
						"types",
						"typings",
						"workspaces",
						"resolutions",
						"dependencies",
						"bundleDependencies",
						"bundledDependencies",
						"peerDependencies",
						"peerDependenciesMeta",
						"optionalDependencies",
						"devDependencies",
						"keywords",
						"engines",
						"engineStrict",
						"os",
						"cpu",
						"*",
						"packageManager",
					],
				},
				{ pathPattern: "^repository$", order: ["type", "url", "directory"] },
				{ pathPattern: "^vague$", order: { type: "asc" } },
				{ pathPattern: "^exports$", order: ["."] },
				{ pathPattern: ".*", order: { type: "asc" } },
			],
		},
	},
	{
		files: ["**/*.md"],
		plugins: { markdown },
		language: "markdown/gfm",
		extends: ["markdown/recommended"],
	},
	eslintConfigPrettier,
]);
