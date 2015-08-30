# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

#### [0.9.7] - 2015-08-25
##### Added/Fixed
- Added the name argument as a **passed argument** to the $LogProvider constructor
- Made class methods for specific log methods
- Validate instantiated log call against declared log level
- Added the ability to set many log levels
- Made all directory references relative to p.cwd
- Added additional documentation
- Fixed/Added tests
- Updated README

#### [0.9.6] - 2015-08-25
##### Changed/Removed
- Removed documentation and distribution files
- Changed the postinstall and prepublish npm scripts

#### [0.9.5] - 2015-08-24
##### Removed
- Removed the extraneous `$shell` function from the main project file, `$LogProvider`.

#### [0.9.4] - 2015-08-23
##### Fixed
- Fixed versioning inconsistencies from 0.9.3.

#### [0.9.3] - 2015-08-23
##### Removed/Added
- Removed documentation from `.gitignore`
- Removed unnecessary `use strict;` lines from many files.
- Created a `dist` folder/runtime with an equivalent pre-compiled Angie Log framework.

#### [0.9.2] - 2015-08-08
##### Changed/Removed
- Update README
- Remove the `Connect` package from dependencies

#### [0.9.1] - 2015-07-08
##### Fixed
- Fixed imports, removed trivial files so this package can more easily be imported.

## [0.9.0] - 2015-07-07
### Added
- Modified project to be able to be imported
- Added ability to instantiate a custom logger (see README)
- Added many tests

#### [0.0.2] - 2015-07-06
##### Added
- Extrapolated log files from Angie project.