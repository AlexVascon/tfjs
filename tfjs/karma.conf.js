/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

const karmaTypescriptConfig = {
  tsconfig: 'tsconfig.test.json',
  // Disable coverage reports and instrumentation by default for tests
  coverageOptions: {instrumentation: false},
  reports: {},
  bundlerOptions: {
    acornOptions: {ecmaVersion: 8},
    transforms: [
      require('karma-typescript-es6-transform')({
        presets: [
          // ensure we get es5 by adding IE 11 as a target
          ['@babel/env', {'targets': {'ie': '11'}, 'loose': true}]
        ]
      }),
    ]
  }
};

// Enable coverage reports and instrumentation under KARMA_COVERAGE=1 env
const coverageEnabled = !!process.env.KARMA_COVERAGE;
if (coverageEnabled) {
  karmaTypescriptConfig.coverageOptions.instrumentation = true;
  karmaTypescriptConfig.coverageOptions.exclude = /_test\.ts$/;
  karmaTypescriptConfig.reports = {html: 'coverage', 'text-summary': ''};
}

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      {pattern: './node_modules/@babel/polyfill/dist/polyfill.js'},
      {pattern: 'src/**/*.ts'}
    ],
    preprocessors: {
      '**/*.ts': ['karma-typescript'],  // *.tsx for React Jsx
    },
    karmaTypescriptConfig,
    reporters: ['progress', 'karma-typescript'],
    browsers: ['Chrome'],
    port: 9200,
    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_KEY,
      tunnelIdentifier:
          `tfjs_union_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    },
    reportSlowerThan: 500,
    browserNoActivityTimeout: 30000,
    customLaunchers: {
      bs_chrome_mac: {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: 'latest',
        os: 'OS X',
        os_version: 'Sierra'
      },
      bs_firefox_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: 'latest',
        os: 'OS X',
        os_version: 'Sierra'
      },
      chrome_with_swift_shader: {
        base: 'Chrome',
        flags: ['--blacklist-accelerated-compositing', '--blacklist-webgl']
      }
    },
    client: {args: ['--grep', config.grep || '']}
  });
};
