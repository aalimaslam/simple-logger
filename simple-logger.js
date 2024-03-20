const fs = require("fs");
const path = require("path");

class Logger {
  #type;
  #pathToLog;
  #size;
  #currentFile;
  constructor(type = 'console', pathToLog = path.join(__dirname, "/logs"), size = 5 * 1024 * 1024) {
    this.#type = type;
    this.#pathToLog = pathToLog;
    this.#size = size;
    this.#currentFile = this.#getNewFile();
  }

  #message = `[type] - date - message`;
  #levels = ['error', 'debug', 'info'];

  #getNewFile() {
    if (!fs.existsSync(this.#pathToLog)) {
      fs.mkdirSync(this.#pathToLog, { recursive: true });
    }

    let i = 0;
    while (true) {
      const filePath = path.join(this.#pathToLog, `log${i}.log`);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
        return fs.createWriteStream(filePath, { flags: 'a' });
      }
      const stats = fs.statSync(filePath);
      if (stats.size < this.#size) {
        return fs.createWriteStream(filePath, { flags: 'a' });
      }
      i++;
    }
  }

  #log(level, message) {
    if (!(this.#levels.find((levels) => levels.toLowerCase() == level.toLowerCase()))) throw new Error("Invalid Type");
    if (this.#pathToLog.split("").find((item) => item == '.')) throw new Error("Invalid Path")
    const logMessage = `${this.#message.replace("type", level).replace("date", new Date().toISOString().split("T")[0] + " " + new Date().toISOString().split("T")[1].split("Z")[0]).replace("message", message.toString())}\n`;
    if (this.#type == 'file') {
      this.#currentFile.write(logMessage);
      const stats = fs.statSync(this.#currentFile.path);
      if (stats.size >= this.#size) {
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
