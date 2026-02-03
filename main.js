//
// Плагин для починки цветовых переменных командной библиотеки после импорта из Фигмы в Pixso
// Связанным плагиным создайте в фигме старницу с раскаладкой переменных
// добавить созранение библиотеки сответсвия в хранилище файла
// и проверку при вызове библиотеки соответвия при загрузке, если она есть выставлять флаг что есть

pixso.showUI(__html__);

let selectToChange;
let colorLib = [];



pixso.ui.onmessage = (msg) => {

  selectToChange = pixso.currentPage.selection;

  if(msg.type === "get-info" || msg.type === "repair-color" || msg.type === "repair-inst") {

    if (selectToChange.length === 0 || selectToChange.length === undefined) {
      pixso.ui.postMessage("not-selection")
      return
    }
  }

  if (msg.type === "get-info") {
    objInfo(selectToChange);
  }

  if (msg.type === "repair-inst") {

    // const checkteamLib = await pixso.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    //
    // if (checkteamLib.length === 0 || checkteamLib.length === undefined) {
    //   pixso.ui.postMessage("not-library")
    //   return
    // }

    instRepair(selectToChange);
    pixso.ui.postMessage("repaired");
  }

  if (msg.type === "repair-color") {

    if (colorLib.length === 0) {
        pixso.ui.postMessage("not-library")
      return
    }
    async function handletokenRepair() {
      try {
        const result = await tokenRepair(selectToChange);
        pixso.ui.postMessage("repaired");
      } catch (error) {
        // console.error("Произошла ошибка:", error);
      }
    }
    handletokenRepair();
  }

  if (msg.type === "create-lib") {
    createExportLib();
  }

  if (msg.type === "get-lib") {
    async function handleGetLib() {
      try {
        const result = await getExportLib();
        pixso.ui.postMessage("lib-ready")
      } catch (error) {
        // console.error("Произошла ошибка:", error);
      }
    }
    handleGetLib();
    }
}


function objInfo(selectObj) {

  const node = selectObj[0];

  console.log(node)

  let nodeFills = " ";
  let nodeStrokes = " ";


  if (node.fills[0]?.hasOwnProperty('boundVariables')) {
    nodeFills = node.fills[0].boundVariables.color.id;
    nodeFills = "\nfills: \n" + nodeFills.split('/')[0];
  }


  if (node.strokes[0]?.hasOwnProperty('boundVariables')) {
    nodeStrokes = node.strokes[0].boundVariables.color.id;
    nodeStrokes = "\nstrokes: \n" + nodeStrokes.split('/')[0];
  }

  const objectInfo = "*** Object Info" + nodeFills + nodeStrokes;

  pixso.ui.postMessage(objectInfo)

}

async function instRepair(checkObj) {

  const libInfo = await pixso.getLibraryComponentsInUse();
  console.log(checkObj, libInfo);

}

async function tokenRepair(checkObj) {


  for (const node of checkObj) {

    if (node.fills[0]?.hasOwnProperty('boundVariables')) {
      const fillId = node.fills[0]?.boundVariables.color.id.split('/')[0];
      await fixFillColor(node.id, fillId);
    }

    if (node.strokes[0]?.hasOwnProperty('boundVariables')) {
      const strokesId = node.strokes[0]?.boundVariables.color.id.split('/')[0];
      await fixStrokeColor(node.id, strokesId);
    }

    if (node.childrenCount > 0) {

      const nodeTree = await node.findAllWithCriteria({types: ['COMPONENT', 'COMPONENT_SET', 'ELLIPSE', 'FRAME', 'GROUP', 'INSTANCE', 'VECTOR', 'RECTANGLE', 'POLYGON', 'LINE', 'TEXT']});

      for (const item of nodeTree) {

        const targetId = item.id

        if (item.fills[0]?.type === "SOLID" && item.fills[0]?.boundVariables) {

          let targetFillColorId = item.fills[0].boundVariables.color.id;
          targetFillColorId = targetFillColorId.split('/')[0];
          await fixFillColor(targetId, targetFillColorId)
        }

        if (item.strokes[0]?.type === "SOLID" &&  item.strokes[0]?.boundVariables) {

          let targetStrokesColorId = item.strokes[0].boundVariables.color.id;
          targetStrokesColorId = targetStrokesColorId.split('/')[0];
          await fixStrokeColor(targetId, targetStrokesColorId)
        }
      }
    }
  }
  return true
}

async function fixFillColor(nodeId, nodeColorId) {

  const targetNode = pixso.getNodeById(nodeId);

  const libExtract = colorLib.filter(item => item.keyin === nodeColorId)

  if (libExtract.length > 0) {

    const bindVariable = await pixso.variables.importVariableByKeyAsync(libExtract[0].keyout);

    const fillsCopy = [...targetNode.fills];
    if (fillsCopy[0].type === 'SOLID') {
      fillsCopy[0] = pixso.variables.setBoundVariableForPaint(fillsCopy[0], 'color', bindVariable);
    }
    targetNode.fills = fillsCopy; // обновляем цвет заливки ноды
  }
}

async function fixStrokeColor(nodeId, nodeColorId) {

  const targetNode = pixso.getNodeById(nodeId);

  const libExtract = colorLib.filter(item => item.keyin === nodeColorId)

  if (libExtract.length > 0) {

    const bindVariable = await pixso.variables.importVariableByKeyAsync(libExtract[0].keyout);

    const strokesCopy = [...targetNode.strokes];
    if (strokesCopy[0].type === 'SOLID') {
      strokesCopy[0] = pixso.variables.setBoundVariableForPaint(strokesCopy[0], 'color', bindVariable);
    }
    targetNode.strokes = strokesCopy; // обновляем цвет строки ноды
  }
}

async function createExportLib() {

  const newExportLibPage = pixso.createPage();
        newExportLibPage.name = "Export Lib";

  pixso.root.insertChild(0, newExportLibPage)
  pixso.currentPage = newExportLibPage;

  const teamLib = await pixso.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

  // долгий но правильный путь собираем цвета по всем коллекциям

  // let colorTokens = []
  //
  // for (const item of teamLib) {
  //
  //   const collectionVars = await pixso.teamLibrary.getVariablesInLibraryCollectionAsync(item.key);
  //
  //   for (const itemVar of collectionVars) {
  //
  //     const selectVar = await pixso.variables.importVariableByKeyAsync(itemVar.key);
  //
  //     if(selectVar.resolvedType === "COLOR") {
  //       colorTokens.push(selectVar)
  //     }
  //   }
  // }

  // быстрый путь без перебора, если знаем коллецию и что она точно из цветов
  const colorCollection = teamLib.find(item => item.name.includes("Color"));
  const colorTokens = await pixso.teamLibrary.getVariablesInLibraryCollectionAsync(colorCollection.key);

  colorTokens.forEach((tokenItem, index) => {

    const rect1 = pixso.createRectangle();
          rect1.y = (index * 100) + 100;
          rect1.resize(100, 50);
          rect1.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }]
          rect1.name = "**v:" + tokenItem.name

    setFill(rect1, tokenItem.key)

    const rect2 = pixso.createRectangle();
          rect2.x = 120;
          rect2.y = (index * 100) + 100;
          rect2.resize(100, 50);
          rect2.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]


    const colorNameText = pixso.createText();
          colorNameText.characters = tokenItem.name;
          colorNameText.x = -350;
          colorNameText.y = (index * 100) + 100;
          colorNameText.resize(330, 50);
          colorNameText.fontSize = 18


   const newGroup = pixso.group([rect1, rect2, colorNameText], pixso.currentPage)
    newGroup.name = "#" + (index + 1)  + ": " + tokenItem.name

  })

  pixso.ui.postMessage("lib-created")

}

async function setFill (node, tokenKey) {

  const bindVariable = await pixso.variables.importVariableByKeyAsync(tokenKey);

  const fillsCopy = [...node.fills];
        fillsCopy[0] = pixso.variables.setBoundVariableForPaint(fillsCopy[0], 'color', bindVariable);

  node.fills = fillsCopy;
}

async function getExportLib() {

  const exportLib = await pixso.root.findChildAsync(n => n.name === "Export Lib");
  const teamLib = await pixso.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

  const checkExportLib = exportLib !== null;
  const checkTeamLib = teamLib.length > 0;

  if (checkExportLib && checkTeamLib) {

    pixso.currentPage = exportLib;

  } else {

    pixso.ui.postMessage("lib-not-found")
    return
  }


  const pageObj = await pixso.currentPage.findAllAsync(n => n.name.startsWith("**"));

  const colorCollection = teamLib.find(item => item.name.includes("Color"));
  const teamLibTokens = await pixso.teamLibrary.getVariablesInLibraryCollectionAsync(colorCollection.key);

  for (const itemObj of pageObj) {

    const objName =  itemObj.name.slice(2)
    const itemToken = teamLibTokens.find(item => item.name.includes(objName));
    const objToken = objKey(itemObj)

    colorLib.push({name: itemToken.name, keyin: objToken,  keyout: itemToken.key })
  }

  await pixso.clientStorage.setAsync('setColorLib', colorLib);
}

function objKey(node) {

  let nodeFills;

  if (node.fills[0]?.hasOwnProperty('boundVariables')) {
    nodeFills = node.fills[0].boundVariables.color.id;
    nodeFills = nodeFills.split('/')[0];
  }

  return nodeFills;

}





