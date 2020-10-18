const toDoForm = document.querySelector(".js-toDoForm"),
  toDoInput = toDoForm.querySelector("input"),
  toDoListPending = document.querySelector(".js-toDoListPending"),
  toDoListFinished = document.querySelector(".js-toDoListFinished");

const TODOS_PENDING_LS = "pending",
  TODOS_FINISHED_LS = "finished";

let arrToDosPending = [],
  arrToDosFinished = [];

function saveToDos(keyToDos, valueToDos) {
  //console.log("저장", keyToDos, valueToDos);
  localStorage.setItem(keyToDos, JSON.stringify(valueToDos));
}

function deleteToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  // const span = btn.previousSibling.previousSibling;
  // const text = span.innerText;
  // const toDoListCurrent =
  //   btn.innerText === "✅" ? toDoListPending : toDoListFinished;
  // 지워진 내용을 저장할 LS
  let mode = "";
  if (btn.innerText === "✅") {
    mode = TODOS_PENDING_LS;
  } else if (btn.innerText === "⏪") {
    mode = TODOS_FINISHED_LS;
  } else {
    if (btn.nextSibling.innerText === "✅") {
      mode = TODOS_PENDING_LS;
    } else if (btn.nextSibling.innerText === "⏪") {
      mode = TODOS_FINISHED_LS;
    }
  }

  console.log(mode);
  if (mode === "pending") {
    console.log(arrToDosPending);
    toDoListPending.removeChild(li);
    const arrCleanToDosPending = arrToDosPending.filter(function (toDo) {
      return toDo.id !== parseInt(li.id);
    });
    arrToDosPending = arrCleanToDosPending;
    console.log(arrToDosPending);
    saveToDos(TODOS_PENDING_LS, arrToDosPending);
  } else if (mode === "finished") {
    toDoListFinished.removeChild(li);
    const arrCleanToDosPending = arrToDosFinished.filter(function (toDo) {
      return toDo.id !== parseInt(li.id);
    });
    arrToDosFinished = arrCleanToDosPending;
    saveToDos(TODOS_FINISHED_LS, arrToDosFinished);
  } else {
  }
}

function moveToDo(event) {
  // 기존에서 삭제
  // 페인트 옆 타겟
  //  if  구분자 필요
  const btn = event.target;
  const span = btn.previousSibling.previousSibling;
  const text = span.innerText;
  const TODOS_CURRENT_LS =
    btn.innerText === "✅" ? TODOS_FINISHED_LS : TODOS_PENDING_LS;
  //const toDoCurrentList = btn.innerText === "✅" ? toDosFinished : toDosPending;
  deleteToDo(event);

  if (btn.innerText !== "❌") {
    paintToDo(text, TODOS_CURRENT_LS);
  }
}

// 핸들에서 페인트할때 타겟(펜딩인지, 피니시인지) 지정하여 호출
function paintToDo(text, targetLS) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const moveBtn = document.createElement("button");
  const span = document.createElement("span");
  const arrToDosCurrent =
    targetLS === TODOS_PENDING_LS ? arrToDosPending : arrToDosFinished;
  const newId = arrToDosCurrent.length + 1;

  delBtn.innerText = "❌"; //
  delBtn.addEventListener("click", deleteToDo);
  moveBtn.innerHTML = targetLS === TODOS_PENDING_LS ? "✅" : "⏪";
  moveBtn.addEventListener("click", moveToDo);
  span.innerText = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(moveBtn);
  li.id = newId;
  if (targetLS === TODOS_PENDING_LS) {
    toDoListPending.appendChild(li);
  } else {
    toDoListFinished.appendChild(li);
  }
  const toDoObj = {
    text: text,
    id: newId,
  };
  arrToDosCurrent.push(toDoObj);
  //saveToDos();

  saveToDos(targetLS, arrToDosCurrent);
}

function loadToDos(targetLS) {
  const loadedToDosPending = localStorage.getItem(TODOS_PENDING_LS);
  const loadedToDosFinished = localStorage.getItem(TODOS_FINISHED_LS);

  if (loadedToDosPending !== null) {
    const parsedToDos = JSON.parse(loadedToDosPending);
    parsedToDos.forEach(function (toDo) {
      paintToDo(toDo.text, TODOS_PENDING_LS);
    });
  }

  if (loadedToDosFinished !== null) {
    const parsedToDos = JSON.parse(loadedToDosFinished);
    parsedToDos.forEach(function (toDo) {
      paintToDo(toDo.text, TODOS_FINISHED_LS);
    });
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const currentText = toDoInput.value;
  paintToDo(currentText, TODOS_PENDING_LS);
  toDoForm.value = "";
}

function init() {
  loadToDos();
  toDoForm.addEventListener("submit", handleSubmit);
}

init();
