const storage = () => {};

const displayController = () => {
  const body = document.querySelector("body");
  let input = document.querySelector(".prompt");
  let form = document.querySelector(".currentForm");

  function createPs1() {
    const div = document.createElement('div')
    const p = document.createElement('p')
    const spanUser = document.createElement("span");
    const spanHost = document.createElement("span");
    const spanDir = document.createElement("span");
    const form = document.createElement('form')
    const input = document.createElement('input')
    spanUser.innerText = 'user'
    spanHost.innerText = '@sevaaaDev'
    spanDir.innerText = '[~]'
    p.appendChild(spanUser)
    p.appendChild(spanHost)
    p.appendChild(spanDir)
    p.append('$')
    input.classList.add('prompt')
    form.appendChild(input)
    form.classList.add('currentForm')
    div.classList.add('ps1')
    div.appendChild(p)
    div.appendChild(form)
    body.appendChild(div)
  }

  function enter() {
    createPs1()
    input.disabled = true
    input.classList.remove('prompt')
    input = document.querySelector('.prompt')
    input.focus()
    console.log(input)
    form.classList.remove('currentForm')
    form = document.querySelector('.currentForm')
    console.log(form)
  }

  function ls() {
    const dir = document.createElement("p");
    dir.innerText = "tes";
    body.appendChild(dir);
    enter();
  }

  function getInput() {
    return input
  }

  function getForm() {
    return form
  }

  return { input, form, ls, enter, getInput, getForm };
};

const inputController = (() => {
  const display = displayController();
  let form = display.getForm()
  listenForm()
  window.addEventListener("click", () => {
    input = display.getInput()
    form = display.getForm()
    input.focus();
  });

  function submit(e) {
    e.preventDefault();
    checkInput();
    form = display.getForm()
    listenForm()
  }
  
  function listenForm() {
    form.addEventListener("submit", submit);
  }
  
  function checkInput() {
    if (display.input.value === "ls") {
      display.ls();
      form = display.getForm()
      console.log(form)
    }
  }
})();
