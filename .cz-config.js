/* eslint-disable no-undef */
module.exports = {
  types: [
    { value: 'feat', name: 'feat:     A new feature' },
    { value: 'fix', name: 'fix:      A bug fix' },
    { value: 'docs', name: 'docs:     Documentation only changes' },
    {
      value: 'style',
      name: "style:    Changes that don't affect code meaning (formatting, semicolons, etc.)",
    },
    {
      value: 'refactor',
      name: 'refactor: Code change that neither fixes bugs nor adds features',
    },
    { value: 'perf', name: 'perf:     Code change that improves performance' },
    {
      value: 'test',
      name: 'test:     Adding missing tests or correcting existing tests',
    },
    {
      value: 'chore',
      name: 'chore:    Changes to dependencies, build process, or CI/CD',
    },
    { value: 'ci', name: 'ci:       Changes to CI/CD configuration' },
    { value: 'build', name: 'build:    Changes to build system' },
    { value: 'revert', name: 'revert:   Revert to a previous commit' },
  ],

  scopes: [
    { name: 'onboarding' },
    { name: 'auth' },
    { name: 'appointments' },
    { name: 'home' },
    { name: 'nearby' },
    { name: 'parental' },
    { name: 'account' },
    { name: 'api' },
    { name: 'i18n' },
    { name: 'storage' },
    { name: 'navigation' },
    { name: 'ui' },
    { name: 'theme' },
    { name: 'core' },
    { name: 'config' },
    { name: 'build' },
    { name: 'ci' },
    { name: 'deps' },
    { name: 'tests' },
  ],

  scopeOverrides: {
    fix: [
      { name: 'merge-conflicts' },
      { name: 'style' },
      { name: 'e2e' },
      { name: 'unit' },
    ],
  },

  messages: {
    type: 'What type of change are you making?',
    scope: '\nWhat is the scope of this change? (e.g., auth, appointments)',
    subject: 'Write a short, imperative tense description of the change:\n',
    body: 'Provide a longer description of the changes:\n (press enter twice to finish)\n',
    breaking: 'Are there any breaking changes?\n',
    breakingBody:
      'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself:\n',
    footer: 'Any issue references (e.g. #123, #456):\n',
    footerPrefix: 'Closes',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },

  allowBreakingChanges: ['feat', 'fix', 'refactor', 'revert'],
  allowCustomScopes: true,
  skipQuestions: [],

  subjectLimit: 100,
  breaklineChar: '|',
  upperCaseSubject: false,
  maxHeaderWidth: 100,
};
