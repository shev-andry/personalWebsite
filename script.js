"use strict";

// TODO refactor changeDir function
// TODO refactor the directory

const storageController = () => {
  let folderDirectory = {
    "~": ["project/", "profile/"],
    "project/": [],
  };

  let fileDirectory = {
    "~": [""],
    "project/": ["kalculator.txt"],
  };

  let realDirectory = {
    kalculator: {
      preview: "https://sevaaadev.github.io/kalculator",
      source: "https://github.com/sevaaadev/kalculator",
    },
  };

  let prevWorkingDir = "";
  let workingDir = "~";
  let prevDir = "";
  let currentDir = workingDir;

  function changeDir(newDir) {
    if (folderDirectory[currentDir].includes(newDir)) {
      prevWorkingDir = workingDir;
      prevDir = currentDir;
      currentDir = newDir;
      return (workingDir = `${workingDir}/${newDir}`);
    }
    if (folderDirectory[currentDir].includes(`${newDir}/`)) {
      prevWorkingDir = workingDir;
      prevDir = currentDir;
      currentDir = `${newDir}/`;
      return (workingDir = `${workingDir}/${newDir}`);
    }
    if (!newDir === "..") return false
    if (currentDir === "~") return "where u goin";
    currentDir = prevDir;
    return (workingDir = prevWorkingDir);
  }

  function getDir() {
    return workingDir;
  }

  function getList() {
    return `${folderDirectory[currentDir].join(" ")} ${fileDirectory[
      currentDir
    ].join(" ")}`
      .split(" ")
      .sort()
      .join(" ");
  }

  function cat(file) {
    if (!fileDirectory[currentDir].includes(file)) return "No such file";
    let content = "";
    for (let prop in realDirectory[file.replace(".txt", "")]) {
      content = `${content} 
      ${realDirectory[file.replace(".txt", "")][prop]}`;
    }
    return content;
  }

  function open(file) {
    if (!fileDirectory[currentDir].includes(file)) return "No such file";
    window.open(realDirectory[file.replace(".txt", "")]["preview"], "_blank");
    return "Opening in another tab...";
  }

  return { changeDir, getDir, getList, cat, open };
};

const displayController = () => {
  const storage = storageController();
  const container = document.querySelector(".container");
  let input = document.querySelector(".prompt");
  let form = document.querySelector(".currentForm");

  function createPs1() {
    const div = document.createElement("div");
    const p = document.createElement("p");
    const spanUser = document.createElement("span");
    const spanHost = document.createElement("span");
    const spanDir = document.createElement("span");
    const form = document.createElement("form");
    const input = document.createElement("input");
    spanUser.innerText = "user";
    spanUser.classList.add("user");
    spanHost.innerText = "@sevaaaDev";
    spanHost.classList.add("host");
    spanDir.innerText = `[${storage.getDir()}]`;
    spanDir.classList.add("dir");
    p.appendChild(spanUser);
    p.appendChild(spanHost);
    p.appendChild(spanDir);
    p.append("$");
    input.classList.add("prompt");
    form.appendChild(input);
    form.classList.add("currentForm");
    div.classList.add("ps1");
    div.appendChild(p);
    div.appendChild(form);
    container.appendChild(div);
  }

  function enter() {
    createPs1();
    input.disabled = true;
    input.classList.remove("prompt");
    input = document.querySelector(".prompt");
    input.focus();
    console.log(input);
    form.classList.remove("currentForm");
    form = document.querySelector(".currentForm");
    console.log(form);
  }

  function getInput() {
    return input;
  }

  function getForm() {
    return form;
  }

  function wrongCommand() {
    const error = document.createElement("p");
    error.innerText = 'Command not found, type "?" to see list of all command';
    container.appendChild(error);
    enter();
  }

  let command = {
    "": () => {
      enter();
    },
    "?": () => {
      const lscommand = document.createElement("p");
      lscommand.innerText = `cd <directory> [change directory]
      cat <file-name> [see the content inside of a file]
      open <file-name> [open the link inside of a file]
      ls [list file & folder]
      cls [clear]`;
      container.appendChild(lscommand);
      enter();
    },
    ls: () => {
      const list = document.createElement("p");
      list.innerText = storage.getList();
      console.log(storage.getList());
      container.appendChild(list);
      enter();
    },
    cls: () => {
      container.innerHTML = "";
      enter();
    },
    cd: (newDir) => {
      const value = storage.changeDir(newDir);
      const info = document.createElement("p");
      if (value === false) {
        info.innerText = "No such directory";
        container.appendChild(info);
      }
      if (value === "where u goin") {
        info.innerText = "There is no directory up there";
        container.appendChild(info);
      }
      enter();
    },
    cat: (file) => {
      const content = document.createElement("p");
      content.innerText = storage.cat(file);
      container.append(content);
      enter();
    },
    open: (file) => {
      const info = document.createElement("p");
      info.innerText = storage.open(file);
      container.append(info);
      enter();
    },
  };

  return { enter, getInput, getForm, command, wrongCommand };
};

const inputController = (() => {
  const display = displayController();
  let form = display.getForm();
  let input = display.getInput();
  listenForm();
  window.addEventListener("click", () => {
    input.focus();
  });

  function submit(e) {
    e.preventDefault();
    checkInput();
    input = display.getInput();
    form = display.getForm();
    listenForm();
  }

  function listenForm() {
    form.addEventListener("submit", submit);
  }

  function checkInput() {
    const command = getCommand();
    const param = getParam();
    if (!display.command[command]) return display.wrongCommand();
    display.command[command](param);
  }

  function getCommand() {
    let space = input.value.trim().indexOf(" ");
    return space === -1
      ? input.value.trim()
      : input.value.trim().slice(0, space);
  }

  function getParam() {
    let space = input.value.trim().indexOf(" ");
    return input.value
      .trim()
      .slice(space + 1)
      .trim();
  }
})();
