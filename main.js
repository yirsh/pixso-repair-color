// Плагин для починки стилией после импорта из Фигмы


pixso.showUI(__html__);

const allColor = pixso.getLocalPaintStyles();
const allTextStyle = pixso.getLocalTextStyles();

const timeStamp = Date.now();

let colorMode;
let selectToChange;

import { colorLib } from './colorlib.js';

pixso.ui.onmessage = (msg) => {

  selectToChange = pixso.currentPage.selection;

  if(selectToChange.length !== 0 && msg.type === "get-info") {

    objInfo(selectToChange);

  }


  if(selectToChange.length !== 0 && msg.type === "repair-obj") {

    tokenRepair(selectToChange);

  }


}

async function objInfo(checkObj) {

  console.log(pixso.apiVersion)
  console.log("+++")

  const node = pixso.getNodeById(checkObj[0].id);

  console.log(checkObj)
  console.log(node)

  let nodeFills = node.fills[0].boundVariables.color.id;
  nodeFills = nodeFills.split('/')[0];

  console.log("nodeFills: " + nodeFills)

}

async function tokenRepair(checkObj) {

  const localCollections = await pixso.variables.getLocalVariablesAsync();

  const node = pixso.getNodeById(checkObj[0].id);

  const nodeTreeNotText = await node.findAllWithCriteria({types: ['COMPONENT', 'COMPONENT_SET', 'ELLIPSE', 'FRAME', 'GROUP', 'INSTANCE', 'VECTOR', 'RECTANGLE', 'POLYGON', 'LINE']});
  const nodeTreeText = await node.findAllWithCriteria({types: ['TEXT']});

  const nodeHasFill = [];

  nodeTreeNotText.forEach((item) => {   // отбираем имееющие привязку переменной к заливке ноды

    if (item.fills[0]) {
      if (item.fills[0].boundVariables) {
        nodeHasFill.push(item)
      }
    }
  })

  nodeHasFill.forEach((item) => {  // обрабатываем цвета заливки

    const targetId = item.id

    let targetColorId = item.fills[0].boundVariables.color.id;
    targetColorId = targetColorId.split('/')[0];

    fixFillColor(targetId, targetColorId)

  })

}

async function fixFillColor(nodeId, nodeColorId) {

  // colorLib

  const targetNode = pixso.getNodeById(nodeId);

  const libExtract = colorLib.filter(item => item.id0 === nodeColorId)


  if (libExtract.length > 0) {

    const bindVariable = await pixso.variables.importVariableByKeyAsync(libExtract[0].id1);

    const fillsCopy = [...targetNode.fills];
    fillsCopy[0] = pixso.variables.setBoundVariableForPaint(fillsCopy[0], 'color', bindVariable);

    // обновляем ноду
    targetNode.fills = fillsCopy;

  }
}


