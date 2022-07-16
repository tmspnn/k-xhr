import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";

test("kxhr", async (t) => {
	const libStr = readFileSync("./dist/kxhr.min.js");
	const eq = assert.strictEqual;
	const dom = new JSDOM(
		`<!doctype html>
		<html>
			<head></head>
			<body>
				<script>${libStr}</script>
			</body>
		</html>`,
		{ runScripts: "dangerously" }
	);
	const window = dom.window;

	await t.test("Get", (t) => {
		window
			.eval(`kxhr("https://jsonplaceholder.typicode.com/todos/1")`)
			.then((res) => {
				const json = JSON.parse(res);
				eq(json.id, 1);
				eq(json.userId, 1);
				eq(json.title, "delectus aut autem");
				eq(json.completed, false);
			});
	});

	await t.test("Post JSON", (t) => {
		window
			.eval(
				`kxhr("https://jsonplaceholder.typicode.com/posts", "post", JSON.stringify({ id: 1, data: "Testing string" }), { contentType: "application/json" })`
			)
			.then((res) => {
				const json = JSON.parse(res);
				eq(json.id, 101);
				eq(json.data, "Testing string");
			});
	});

	await t.test("Cancel", (t) => {
		let i = 0;

		const k = window
			.eval(`kxhr("https://jsonplaceholder.typicode.com/todos/1")`)
			.then(() => ++i)
			.finally(() => eq(i, 0));

		k.cancel();
	});

	await t.test("Await", async (t) => {
		const res = await window.eval(
			`kxhr("https://jsonplaceholder.typicode.com/todos/1")`
		);
		const json = JSON.parse(res);
		eq(json.id, 1);
		eq(json.userId, 1);
		eq(json.title, "delectus aut autem");
		eq(json.completed, false);
	});

	await t.test("Await & Throw", async (t) => {
		try {
			await window.eval(
				`kxhr("https://jsonplaceholder.typicode.com/todos/1").then(() => { throw new Error("Custom error message..."); })`
			);
		} catch (e) {
			eq(e.message, "Custom error message...");
		}
	});
});
