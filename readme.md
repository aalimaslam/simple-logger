# JavaScript Logger

This is a simple JavaScript logger that provides basic functionality for logging messages to either a file or the console.

## Usage

Instantiate the logger using the following syntax:

```javascript
let logger = new Logger({type, pathToLog, size});
```
Where <br>
`type` can be either ` file ` or ` console `<br>
`pathToLog` is the path of directory where you want to store the log files for example ```new Logger({type : "file",  pathToLog : path.join(__dirname, "/logs"), size : 10000}); ```, this will make log files in the logs directory.<br>
`size` is the size of file after which new log file will be created.

## Levels
`error` used to log errors for example `logger.error("this is a error message")` <br>
`info` used to log information for example `logger.info("this is an info message")` <br>
`debug` used to debug for example `logger.debug("this is a debug message")` <br>
