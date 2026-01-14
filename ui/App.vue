
<script setup>
import { ref } from "vue";

const messageTheme = ref("Выберите<br>объект<br>для замены<br>темы");
const messageToken = ref("Инфо");
const messagePage = ref("Починить");
const messageLocal = ref("Выгрузить");

onmessage = (event) => {

  if(event.data.pluginMessage === "not-selection") {
    messageTheme.value = "Объект<br>не выбран"
  }

  if(event.data.pluginMessage === "Dark-success") {
    messageTheme.value = "Тёмная<br>активна"
  }

  if(event.data.pluginMessage === "Light-success") {
    messageTheme.value = "Светлая<br>активна"
  }

  if(event.data.pluginMessage === "ready-token") {
    messageToken.value = "Токены<br>починены";
  }

  // if(event.data.pluginMessage === "ready-local") {
  //   messageLocal.value = "Стили<br>готовы";
  // }

  if(event.data.pluginMessage === "finish-local") {
    messageLocal.value = "Стили<br>готовы";
  }

  if(event.data.pluginMessage.startsWith("** Local")) {

    const fileContent = event.data.pluginMessage;
    const blob = new Blob([fileContent], { type: 'text/css' });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'style.txt';
    a.textContent = 'Скачать файл';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

function updateMsg (target, text) {
  target.value = text;
}


</script>

<template>

  <div class="block-wrap">
    <div class="block">
      <div class="operate">
        <button class="kc-ui-btn" @click="objinfo">Object</button>
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

.output-style {
  white-space: pre;
}

</style>