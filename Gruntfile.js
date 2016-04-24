module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: "./client",
                    src: ["**/*.html", "**/*.css", "**/*.gif"],
                    dest: "./dist/client"
                }]
            }
        },
        babel: {
            options: {
                presets: ["es2015", "react"]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: "./client",
                    src: ["**/*.js"],
                    dest: "./dist/client",
                    ext: ".js"
                }, {
                    expand: true,
                    cwd: "./server",
                    src: ["**/*.js"],
                    dest: "./dist/server",
                    ext: ".js"
                }, {
                    expand: true,
                    cwd: "./client",
                    src: ["**/*.jsx"],
                    dest: "./dist/client",
                    ext: ".jsx"
                }]
            }
        },
        watch: {
            copy: {
                files: ["client/**/*.html"],
                tasks: ["copy"]
            },
            babel: {
                files: [
                    "client/**/*.js",
                    "client/**/*.jsx",
                    "server/**/*.js"
                ],
                tasks: ["babel"]
            },
            webpack: {
                files: ["client/**/*.js","client/**/*.jsx"],
                tasks: ["webpack"]
            }
        },
        webpack: {
            app: {
                entry: "./client/js/main.js",
                output: {
                    path: "./dist/client/js",
                    filename: "main.js"
                },
                module: {
                    loaders: [{
                        test: /.jsx$/,
                        loader: "babel-loader",
                        exclude: /node_modules/,
                        query: {
                            presets: ["es2015", "react"]
                        }
                    }, {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: "babel-loader",
                        query: {
                            presets: ["es2015"]
                        }
                    }]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-webpack");

    grunt.registerTask("default", [
        "copy", "babel", "webpack", "watch"
    ]);
};