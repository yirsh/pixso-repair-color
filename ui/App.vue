
<script setup>
import { ref } from "vue";

const messageToken = ref("Инфо");
const messageInst = ref("Инстансы");
const messageColor = ref("Цвета");
const messageCreate = ref("Экспорт");
const messageGet = ref("Импорт");
const  messageStatus = ref("Выберите объект и действие") //Select an object and action
const  messageLibStatus = ref("Бибилиотеки не сопоставлены") //

onmessage = (event) => {

  if(event.data.pluginMessage === "not-selection") {
    loaderStatusChange();
    messageStatus.value = "Объект не выбран"; // No object selected
    setTimeout(() => {
      messageStatus.value = "Выберите объект и действие"; // Select an object and action
    }, 1800);
  }

  if(event.data.pluginMessage === "lib-created") {
    loaderStatusChange();
    messageStatus.value = "Создана библиотека цветов для экспорта"; // No object selected
    setTimeout(() => {
      messageStatus.value = "Выберите объект и действие"; // Select an object and action
    }, 2800);
  }

  if(event.data.pluginMessage === "lib-not-found") {
    loaderStatusChange();
    messageStatus.value = "Не найдена страница ExportLib<br>или не поключена библиотека"; // Page w/color teamLibrary not found
    setTimeout(() => {
      messageStatus.value = "Выберите объект и действие"; // Select an object and action
    }, 2800);
  }

  if(event.data.pluginMessage === "lib-not-plug") {
    loaderStatusChange();
    messageStatus.value = "Не подключена библиотека команды"; // TeamLibrary not found
    setTimeout(() => {
      messageStatus.value = "Выберите объект и действие"; // Select an object and action
    }, 2800);
  }

  if(event.data.pluginMessage === "lib-ready") {
    messageLibStatus.value = "Библиотеки сопоставлены"; // teamLibrary ready to repair
    const el = document.getElementById("lib-status");
    el.classList.add("ready");
    loaderStatusChange();
  }

  if(event.data.pluginMessage === "not-library") {
    loaderStatusChange();
    messageLibStatus.value = "Cопоставьте библиотеки"; // teamLibrary not ready to repair
    setTimeout(() => {
      messageLibStatus.value = "Бибилиотеки не сопоставлены"; // Select an object and action
    }, 2800);
  }

  if(event.data.pluginMessage === "repaired") {
    loaderStatusChange();
    messageStatus.value = "Токены починены";
    setTimeout(() => {
      messageStatus.value = "Выберите объект и действие"; // Select an object and action
    }, 2400);
  }

  if(event.data.pluginMessage.startsWith("*** Object")) {
    loaderStatusChange();
    messageStatus.value = "Скопировано в буфер"; // Copied to clipboard
    copyToClipboard(event.data.pluginMessage);

    setTimeout(() => {
      messageStatus.value = "Выберите объект и действие"; // Select an object and action
    }, 1800);

  }

}

const objinfo = () => {
  loaderStatusChange();
  parent.postMessage(
      { pluginMessage: { type: "get-info" } },
      "*"
  );
};

const repairColor = () => {
  loaderStatusChange();
  parent.postMessage(
      { pluginMessage: { type: "repair-color" } },
      "*"
  );
};

const repairInst = () => {
  loaderStatusChange();
  parent.postMessage(
      { pluginMessage: { type: "repair-inst" } },
      "*"
  );
};

const createlib = () => {
  loaderStatusChange();
  parent.postMessage(
      { pluginMessage: { type: "create-lib" } },
      "*"
  );
};

  const getlib = () => {
  loaderStatusChange()
  parent.postMessage(
      { pluginMessage: { type: "get-lib" } },
      "*"
  );
};


async function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    const successful = document.execCommand("copy");
    if (successful) {
      // console.log("The text has been copied successfully.:", text);
    } else {
      // console.error("Failed to copy text");
    }
  } catch (error) {
    // console.error("Error copying text:", error);
  } finally {
    document.body.removeChild(textarea);
  }
}

function loaderStatusChange(){

  const el = document.getElementById("loader");
  el.classList.toggle("stop");

}



</script>

<template>

  <div class="block-wrap">
    <div class="block">
      <div class="operate">
        <button class="kc-ui-btn" @click="repairInst">Repair Inst</button>
      </div>
      <div class="message-operate"><span v-html="messageInst"></span></div>
    </div>
    <div class="block">
      <div class="operate">
        <button class="kc-ui-btn" @click="repairColor">Repair Color</button>
      </div>
      <div class="message-operate"><span v-html="messageColor"></span></div>
    </div>
    <div class="block">
      <div class="operate">
        <button class="kc-ui-btn" @click="createlib">Create Lib</button>
      </div>
      <div class="message-operate"><span v-html="messageCreate"></span></div>
    </div>
    <div class="block">
      <div class="operate">
        <button class="kc-ui-btn" @click="getlib">Get Repair Lib</button>
      </div>
      <div class="message-operate"><span v-html="messageGet"></span></div>
    </div>
    <div class="block">
      <div class="operate">
        <button class="kc-ui-btn" @click="objinfo">Obj Info</button>
      </div>
      <div class="message-operate"><span v-html="messageToken"></span></div>
    </div>
  </div>
  <div class="block">
    <div id="lib-status" class="message-lib-status"><span v-html="messageLibStatus"></span></div>
  </div>
  <div class="block">
    <div class="message-status"><span v-html="messageStatus"></span></div>
  </div>  <div class="block">
  <div id="loader" class="status-loader stop"><span class="status-loader-fill"></span></div>
  </div>


</template>

<style>

.block-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 1rem;
}

.block {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-items: center;
  align-items: center;

}

.operate {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  width: 12rem;
  padding-right: 1rem;
  border-right: 1px solid #b1b4cc;
}

.kc-ui-btn {
  background: #ffffff;
  width: auto;
  border: 1px solid #646573;
  color: #36373f;
  font-size: .9rem;
  font-family: sans-serif;
  letter-spacing: .05rem;
  padding: .5rem .75rem;
  border-radius: 1rem;
  box-shadow: 0 0 20px #eee;
  transition: .2s  ease-out;
  /*text-align: left;*/
}

.kc-ui-btn:hover {
  transition: .15s  ease-out;
  background: #1873F2;
  color: white;
  border: 1px solid #1873F2;
}

.kc-ui-btn:active {
  transition: .15s ease-out;
  background: #36373f;
  color: white;
  border: 1px solid #36373f;
}

.message-operate {
  /*display: none;*/
  display: block;
  width: 8rem;
  font-family: sans-serif;
  font-weight: normal;
  font-size: .9rem;
  color: #36373f;
}

.message-status {
  display: block;
  margin-top: 1rem;
  padding: .5rem;
  width: 100%;
  font-family: sans-serif;
  font-weight: normal;
  font-size: .8rem;
  color: #16171a;
}

.message-lib-status {
  display: block;
  margin-top: 1.5rem;
  padding: .5rem .75rem;
  width: 100%;
  background: #e1e1e1;
  border-radius: 1rem;
  font-family: sans-serif;
  font-weight: normal;
  font-size: .8rem;
  letter-spacing: .02rem;
  color: #16171a;
}

.ready {
  background: #d4ffd4;
}

.output-style {
  white-space: pre;
}

.status-loader {
  display: block;
  position: relative;
  margin-top: .5rem;
  height: .5rem;
  width: 100%;
  background: #f5f5f5;
}

.status-loader.stop{
  display:none;
}

.status-loader-fill {
  position: absolute;
  top:0;
  left: 0;
  display: inline-block;
  height: .5rem;
  width: 0;
  background: #1873F2;
  animation-name: loaderAnimation;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes loaderAnimation {
  from {width: 0;}
  to {width: 100%;}
}

</style>