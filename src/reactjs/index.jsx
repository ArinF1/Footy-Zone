import {createRoot} from "react-dom/client";
import { createElement } from "react";
import { connectToFirebase } from "../models/firebaseModel";
import { observable, configure, reaction } from "mobx";
import { ReactRoot } from "/src/reactjs/ReactRoot.jsx"; 
import { model } from "/src/models/footymodel.js"; 

// Se till att React är kompatibelt med eventuella andra ramverk
window.React = { createElement: createElement }; 

// MobX-konfiguration: Tillåt direkta ändringar av tillstånd utan att tvinga "actions"
configure({ enforceActions: "never" });  

/**
 * Gör modellen reaktiv med MobX.
 * Den reaktiva modellen kommer automatiskt att spåra förändringar i tillstånd.
 */
const reactiveModel = observable(model);

/**
 * Utför initial logik, exempelvis en sökning eller datahämtning.
 * Om du vill ha initialdata för sökbaren, kan du initiera en sökning här.
 */
function performInitialSearch() {
  if (reactiveModel.searchParam) {
    reactiveModel.searchParam.text = ""; // Initialisera söktext som tom
    console.log("Initial search performed.");
  }
}

// Kör initial logik
performInitialSearch();

/**
 * Mountar React-applikationen och renderar root-komponenten i DOM:en.
 * Skickar den reaktiva modellen som en prop till `ReactRoot` för tillståndshantering.
 */
createRoot(document.getElementById("root"))
  .render(<ReactRoot model={reactiveModel} />);

// Invoking connectToFirebase and passing the MobX reaction to watch the model
connectToFirebase(reactiveModel, reaction);

// Debugging: Exponera den reaktiva modellen för inspektion i konsolen
window.myModel = reactiveModel;


