
<script setup>
import { ref } from "vue";

const messageToken = ref("Инфо");
const messagePage = ref("Починить");
const  messageStatus = ref("Выберите объект и действие") //Select an object and action

onmessage = (event) => {

  if(event.data.pluginMessage === "not-selection") {
    messageStatus.value = "Объект не выбран"; // No object selected
    setTimeout(() => {
      messageStatus.value = "Выберите объект и действие"; // Select an object and action
    }, 1800);
  }

  if(event.data.pluginMessage === "ready-token") {
    messageToken.value = "Токены<br>починены";
  }

  if(event.data.pluginMessage.startsWith("** Object")) {

    messageStatus.value = "Скопировано в буфер"; // Copied to clipboard
    copyToClipboard(event.data.pluginMessage);

    setTimeout(() => {
      messageStatus.value = "Выберите объект и действие"; // Select an object and action
    }, 1800);

  }

}

const objinfo = () => {
  parent.postMessage(
      { pluginMessage: { type: "get-info" } },
      "*"
  );
};

const repair = () => {
  parent.postMessage(
      { pluginMessage: { type: "repair-obj" } },
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



</script>

<template>

  <div class="block-wrap">
    <div class="block">
      <div class="operate">
        <button class="kc-ui-btn" @click="objinfo">Obj Info</button>
      </div>
      <div class="message-operate"><span v-html="messageToken"></span></div>
    </div>
    <div class="block">
      <div class="operate">
        <button class="kc-ui-btn" @click="repair">Repair</button>
      </div>
      <div class="message-operate"><span v-html="messagePage"></span></div>
    </div>
  </div>
  <div class="block">
    <div class="message-status"><span v-html="messageStatus"></span></div>
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
  width: 10rem;
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
  display: block;
  width: 10rem;
  font-family: sans-serif;
  font-weight: normal;
  font-size: .9rem;
  color: #36373f;
}

.message-status {
  display: block;
  margin-top: 1rem;
  padding-top: 1rem;
  width: 100%;
  border-top: 1px solid #ccc ;
  font-family: sans-serif;
  font-weight: normal;
  font-size: .8rem;
  color: #16171a;
}

.output-style {
  white-space: pre;
}

</style>