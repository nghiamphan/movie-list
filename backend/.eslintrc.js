module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: 'eslint:recommended',
    overrides: [
        {
            files: ['.eslintrc.{js,cjs}'],
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'script',
    },
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'windows'],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        eqeqeq: 'error',
        'arrow-spacing': ['error', { before: true, after: true }],
        'no-console': 0,
        'no-unused-vars': 'warn',
    },
}
