const fs = require("fs");
const path = require("path");

class Logger {
  #type;
  #pathToLog;
  #size;
  #currentFile;

  constructor({ type = 'console', pathToLog = path.join(process.cwd(), "logs"), size = 5 * 1024 * 1024 }) {
    this.#type = type;
    this.#pathToLog = this.#sanitizePath(pathToLog);
    this.#size = size;
    this.#currentFile = this.#getNewFile();
  }

  #message = "[type] - [date] - [message]";
  #levels = ['error', 'debug', 'info'];

  // Ensures the path is within the current working directory
  #sanitizePath(pathToLog) {
    const resolvedPath = path.resolve(pathToLog);
    if (!resolvedPath.startsWith(path.resolve(process.cwd()))) {
      throw new Error("Invalid log path");
    }
    return resolvedPath;
  }

  #getNewFile() {
    try {
      // Ensure the directory exists or create it
      if (!fs.existsSync(this.#pathToLog)) {
        fs.mkdirSync(this.#pathToLog, { recursive: true });
      }

      for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
        const filePath = path.join(this.#pathToLog, `log${i}.log`);
        if (!fs.existsSync(filePath)) {
          // If file doesn't exist, create a new file and return a write stream
          const fileStream = fs.createWriteStream(filePath, { flags: 'a' });
          fileStream.on('error', (err) => {
            console.error('Error creating file stream:', err);
          });
          return fileStream;
        }

        const stats = fs.statSync(filePath);
        // If file size is smaller than the limit, use this file
        if (stats.isFile() && stats.size < this.#size) {
          const fileStream = fs.createWriteStream(filePath, { flags: 'a' });
          fileStream.on('error', (err) => {
            console.error('Error creating file stream:', err);
          });
          return fileStream;
        }
      }
      throw new Error("Failed to create a new log file.");
    } catch (err) {
      throw new Error(`Error in log file creation: ${err.message}`);
    }
  }

  #log(level, message) {
    if (!this.#levels.includes(level.toLowerCase())) throw new Error("Invalid Log Level");

    const logMessage = this.#message
      .replace("[type]", level)
      .replace("[date]", new Date().toISOString())
      .replace("[message]", message.toString());

    if (this.#type === 'file') {
      // Check if the current file stream is valid before writing to it
      if (this.#currentFile && this.#currentFile.writable) {
        if (!this.#currentFile.write(logMessage + '\n')) {
          this.#currentFile.once('drain', () => {
          });
        }
        try {
            if(fs.existsSync(this.#currentFile?.path)){
                const stats = fs.statSync(this.#currentFile?.path ?? 0);
                if (stats?.size >= this.#size) {
                  this.#currentFile.end();
                  this.#currentFile = this.#getNewFile();
                }
              }else{
              this.#currentFile = this.#getNewFile();
            }
          } catch (err) {
            console.error('Error checking file size:', err);
          } finally {
      console.log(logMessage);

          }
      } 
      else {
        console.error("File stream is not writable or invalid");
      }
    }
  }

  error(message) {
    this.#log("error", message);
  }

  info(message) {
    this.#log("info", message);
  }

  debug(message) {
    this.#log("debug", message);
  }
}

module.exports = Logger;
