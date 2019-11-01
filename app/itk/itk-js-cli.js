#!/usr/bin/env node

var fs = require('fs-extra');

var path = require('path');

var spawnSync = require('child_process').spawnSync;

var program = require('commander');

var build = function build(sourceDir) {
  // Check that the source directory exists and chdir to it.
  if (!fs.existsSync(sourceDir)) {
    console.error('The source directory: ' + sourceDir + ' does not exist!');
    process.exit(1);
  }

  process.chdir(sourceDir); // Make the 'web-build' directory to hold the dockcross script and the CMake
  // build.

  try {
    fs.mkdirSync('web-build');
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  } // Check that we have docker and can run it.


  var dockerVersion = spawnSync('docker', ['--version'], {
    env: process.env,
    stdio: ['ignore', 'ignore', 'ignore']
  });

  if (dockerVersion.status !== 0) {
    console.error("Could not run the 'docker' command.");
    console.error('This tool requires Docker.');
    console.error('');
    console.error('Please find installation instructions at:');
    console.error('');
    console.error('  https://docs.docker.com/install/');
    console.error('');
    process.exit(dockerVersion.status);
  }

  var dockerImage = 'insighttoolkit/itk-js:20191022-fabc80c';

  if (program.commands[0].image) {
    dockerImage = program.commands[0].image;
  } // Ensure we have the 'dockcross' Docker build environment driver script


  var dockcrossScript = 'web-build/itk-js-build-env';

  try {
    fs.statSync(dockcrossScript);
  } catch (err) {
    if (err.code === 'ENOENT') {
      var output = fs.openSync(dockcrossScript, 'w');
      var dockerCall = spawnSync('docker', ['run', '--rm', dockerImage], {
        env: process.env,
        stdio: ['ignore', output, null]
      });

      if (dockerCall.status !== 0) {
        process.exit(dockerCall.status);
      }

      fs.closeSync(output);
      fs.chmodSync(dockcrossScript, '755');
    } else {
      throw err;
    }
  }

  var hypenIndex = program.rawArgs.findIndex(function (arg) {
    return arg === '--';
  });
  var cmakeArgs = [];

  if (hypenIndex !== -1) {
    cmakeArgs = program.rawArgs.slice(hypenIndex + 1);
  }

  var dockerBuild = spawnSync('bash', [dockcrossScript, 'web-build'].concat(cmakeArgs), {
    env: process.env,
    stdio: 'inherit'
  });
  process.exit(dockerBuild.status);
};

var test = function test(sourceDir) {
  // Check that the source directory exists and chdir to it.
  if (!fs.existsSync(sourceDir)) {
    console.error('The source directory: ' + sourceDir + ' does not exist!');
    process.exit(1);
  }

  process.chdir(sourceDir);
  var dockcrossScript = path.join('web-build/itk-js-build-env');

  try {
    fs.statSync(dockcrossScript);
  } catch (err) {
    console.error('Could not find ' + sourceDir + '/web-build/itk-js-build-env');
    console.error('');
    console.error('Has');
    console.error('');
    console.error('  itk-js build ' + sourceDir);
    console.error('');
    console.error('been executed?');
    process.exit(1);
  }

  var hypenIndex = program.rawArgs.findIndex(function (arg) {
    return arg === '--';
  });
  var ctestArgs = '';

  if (hypenIndex !== -1) {
    ctestArgs = program.rawArgs.slice(hypenIndex + 1).join(' ');
  }

  var dockerBuild = spawnSync('bash', [dockcrossScript, 'bash', '-c', 'cd web-build && ctest ' + ctestArgs], {
    env: process.env,
    stdio: 'inherit'
  });
  process.exit(dockerBuild.status);
};

program.command('build <sourceDir>').usage('[options] <sourceDir> [-- <cmake arguments>]').description('build the CMake project found in the given source directory').action(build).option('-i, --image <image>', 'build environment Docker image, defaults to insighttoolkit/itk-js'); // todo: needs a wrapper in web_add_test that 1) mount /work into the emscripten filesystem
// and 2) invokes the runtime
// program
//   .command('test <sourceDir>')
//   .usage('[options] <sourceDir> [-- <ctest arguments>]')
//   .description('run ctest on the project previously built from the given source directory')
//   .action(test)

program.parse(process.argv);
program.help();