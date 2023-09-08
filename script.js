const storage = () => {
  let folderDirectory = {
    "~": ["project/", "profile/"],
    "project/": [],
  };

  let fileDirectory = {
    "~": [],
    "project/": ["calculator.txt"],
  };

  let realDirectory = {
    calculator :{
    preview: 'https://sevaaadev.github.io/kalculator',
    source: 'https://github.com/sevaaadev/kalculator'
  }
}

  let prevWorkingDir = "";
  let workingDir = "~";
  let prevDir = "";
  let currentDir = workingDir;

  console.log(currentDir);
  function changeDir(newDir) {
    if (newDir === "..") {
      if (currentDir === "~") return "where u goin";
      currentDir = prevDir;
      return (workingDir = prevWorkingDir);
    }
    if (!folderDirectory[currentDir].includes(newDir)) {
      if (folderDirectory[currentDir].includes(`${newDir}/`)) {
        prevWorkingDir = workingDir;
        prevDir = currentDir;
        currentDir = `${newDir}/`;
        return (workingDir = `${workingDir}/${newDir}`);
      }
      return false;
    }
    prevWorkingDir = workingDir;
    prevDir = currentDir;
    currentDir = newDir;
    return (workingDir = `${workingDir}/${newDir}`);
  }

  function getDir() {
    return workingDir;
  }

  function getList() {
    return `${folderDirectory[currentDir].join(" ")} ${fileDirectory[
      currentDir
    ].join(" ")}`
      .split(" ")
      .join(" ");
  }
  
  function cat(file) {
    if (fileDirectory[currentDir].includes(file)) {
      let content = ''
      for (let prop in realDirectory[file.replace('.txt', '')]) {
        content = `${content} 
        ${realDirectory[file.replace('.txt', '')][prop]}`
      }
      return content
    }
    return 'No such file'
  }

  return { changeDir, getDir, getList, cat };
};

const displayController = () => {
  const memory = storage();
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
    spanDir.innerText = `[${memory.getDir()}]`;
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
    const error = document.createElement('p')
    error.innerText = 'Command not found, type "?" to see list of all command'
    container.appendChild(error)
    enter()
  }

  let command = {
    '?': () => {
      const lscommand = document.createElement('p')
      lscommand.innerText = `? [list command]
      cd [change directory]
      ls [list file & folder]
      cls [clear]`
      container.appendChild(lscommand)
      enter()
    },
    ls: () => {
      const list = document.createElement("p");
      list.innerText = memory.getList();
      console.log(memory.getList());
      container.appendChild(list);
      enter();
    },
    cls: () => {
      container.innerHTML = "";
      enter();
    },
    cd: (newDir) => {
      const value = memory.changeDir(newDir);
      const info = document.createElement("p");
      if (value === false) {
        info.innerText = "No such directory";
      } else if (value === "where u goin") {
        info.innerText = "There is no directory up there";
      }
      container.appendChild(info);
      enter();
    },
    cat: (file) => {
      const content = document.createElement('p')
      content.innerText = memory.cat(file)
      container.append(content)
      enter()
    }
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
    if (input.value.includes("cd")) {
      return display.command[input.value.trim().slice(0, 2)](input.value.slice(3).trim());
    }
    if (input.value.includes('cat')) {
      return display.command[input.value.trim().slice(0, 3)](input.value.slice(4).trim())
    }
    if (input.value === "") return display.enter();
    if (!display.command[input.value.trim()]) return display.wrongCommand();
    display.command[input.value.trim()]()
  }
})();
