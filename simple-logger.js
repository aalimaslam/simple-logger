const fs = require("fs");
const path = require("path");

class Logger {
  #type;
  #pathToLog;
  #size;
  #currentFile;

  constructor({ type = 'console', pathToLog = path.join(__dirname, "logs"), size = 5 * 1024 * 1024 }) {
    this.#type = type;
    this.#pathToLog = path.resolve(pathToLog);
    this.#size = size;
    this.#currentFile = this.#getNewFile();
  }

  #message = "[type] - [date] - [message]";
  #levels = ['error', 'debug', 'info'];

  #getNewFile() {
    if (!fs.existsSync(this.#pathToLog)) {
      fs.mkdirSync(this.#pathToLog, { recursive: true });
    }

    for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) { 
      const filePath = path.join(this.#pathToLog, `log${i}.log`);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
        return fs.createWriteStream(filePath, { flags: 'a' });
      }
      const stats = fs.statSync(filePath);
      if (stats.size < this.#size) {
        return fs.createWriteStream(filePath, { flags: 'a' });
      }
    }
    throw new Error("Failed to create a new log file.");
  }

  #log(level, message) {
    if (!this.#levels.includes(level.toLowerCase())) throw new Error("Invalid Log Level");
    const logMessage = this.#message
      .replace("[type]", level)
      .replace("[date]", new Date().toISOString())
      .replace("[message]", message.toString());
    if (this.#type === 'file') {
      this.#currentFile.write(logMessage + '\n');
      const stats = fs.fstatSync(this.#currentFile.fd);
      if (stats.size >= this.#size) {
        this.#currentFile.end();
        this.#currentFile = this.#getNewFile();
      }
    }
    console.log(logMessage);
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
