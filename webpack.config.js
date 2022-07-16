import process from "node:process";

const pwd = process.cwd();

export default {
	mode: "production",
	devtool: false,
	context: pwd+ "/src",
	entry: "./kxhr.js",
	output: {
		path: pwd+ "/dist",
		filename: "kxhr.min.js",
		library: {
			name: "kxhr",
			type: "var",
			export: "default"
		},
		globalObject: "this"
	},
	module: {
		rules: []
	}
};
