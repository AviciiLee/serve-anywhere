module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12
    },
    globals: {
        process: true,
        __dirname: true,
        __filename: true
    },
    "rules": {
        'no-console': 0
    }
};
