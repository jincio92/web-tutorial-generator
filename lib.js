const STORED_SESSION_KEY = 'tutorial-stored-session';

/**
 * @type {TutorialStoredSession}
 */
const DEFAULT_STORED_SESSION = {
    completed: false,
    currentStep: 0
}
/**
 * Schema of the stored session of the tutorial
 * @date 11/30/2023 - 11:56:01 AM
 *
 * @typedef {Object} TutorialStoredSession
 * @property {boolean} completed - whether or not the tutorial has been completed
 * @property {number} currentStep - indicates the current Step of the tutorial
 */

/**
 * Schema of the configuration
 * @date 11/29/2023 - 10:04:33 AM
 *
 * @typedef {Object} TutorialConfig - 
 * @property {() => void} startFunction - 
 * @property {() => void} finishFunction -
 * @property {StepConfig[]} steps - 
 * @property {boolean} enable - 
 */

/**
 * Schema of the Step
 * @date 11/29/2023 - 10:04:33 AM
 * 
 * @typedef {Object} StepConfig - 
 * @property {string} elementId - The id of the element you want to highlight
 * @property {string} title - Title of the step
 * @property {string} text - the text to show during the step
 * @property {() => void} preStep - a function that execute before the highlight take place
 * @property {() => void} postStep - a function that execute after the highlight take place
 * @property {boolean} showPrevButton - whether or not to show the "prev" button
 * @property {boolean} showNextButton - whether ot not to show to "next" button
 * @property {'click'|'none'|'qwe'} nextAction - choose which action will move to the next step: 'click': 
 */

/**
 * Description placeholder
 * @date 11/29/2023 - 10:04:39 AM
 *
 * @class TutorialGenerator
 * @typedef {TutorialGenerator}
 * @extends {HTMLElement}
 * @property {TutorialStoredSession} storedSession - 
 */
class TutorialGenerator extends HTMLElement {
    currentIndex = 0;
    pageWidth = 0;
    pageHeight = 0;

    /**
     * Description placeholder
     * @date 11/30/2023 - 12:05:37 PM
     *
     * @type {TutorialStoredSession}
     */
    storedSession = null;

    constructor() {
        super();
        if (!tutorialGeneratorConfig || !tutorialGeneratorConfig.enable) { return; }
        this.storedSession = JSON.parse(localStorage.getItem(STORED_SESSION_KEY));
        if (this.storedSession == null) {
            this.storedSession = DEFAULT_STORED_SESSION;
            localStorage.setItem(STORED_SESSION_KEY, JSON.stringify(this.storedSession));
        } else if (this.storedSession.completed) {
            return;
        } else {
            this.currentIndex = this.storedSession.currentStep;
        }
        //this.shadow = this.attachShadow({ mode: 'closed' });
        document.addEventListener("DOMContentLoaded", () => {
            //window.addEventListener("load", () => {
            this.pageWidth = document.body.scrollWidth;
            this.pageHeight = document.body.scrollHeight;
            tutorialGeneratorConfig.startFunction();
            setTimeout(() => {
                this.executeStep(tutorialGeneratorConfig.steps[this.currentIndex]);
            }, 500);
        });
    }


    /**
     * Description placeholder
     * @date 11/29/2023 - 10:03:56 AM
     *
     * @param {StepConfig} step
     */
    executeStep(step) {
        step.preStep?.call();

        step.nextAction
        let element = document.getElementById(step.elementId);
        if (element) {
            element.scrollIntoView({ block: "center", behavior: "smooth" });
            let rect = element.getBoundingClientRect();
            let bodyRect = document.body.getBoundingClientRect();
            rect.x = rect.x - bodyRect.x;
            rect.y = rect.y - bodyRect.y;
            this.render(rect, step);
            if (step.nextAction === 'click') {
                //this.shadow.getElementById('tutorialHighlightDiv').addEventListener('click', () => { this.postStep(step) }, { once: true });;
                this.querySelector('#tutorialHighlightDiv').addEventListener('click', () => { this.postStep(step) }, { once: true });;
            }
        }
    }

    postStep(step) {
        this.reset();
        this.currentIndex++;
        this.updateStoredSession();
        step.postStep?.call();
        if (tutorialGeneratorConfig.steps[this.currentIndex]) {
            this.executeStep(tutorialGeneratorConfig.steps[this.currentIndex]);
        } else {
            this.complete();
        }
    }

    prev() {
        this.currentIndex--;
        if (this.currentIndex >= 0) {
            this.updateStoredSession()
            this.executeStep(tutorialGeneratorConfig.steps[this.currentIndex]);
        }
    }

    next() {
        this.postStep(tutorialGeneratorConfig.steps[this.currentIndex]);
    }

    complete() {
        tutorialGeneratorConfig.finishFunction?.call();
    }

    updateStoredSession() {
        this.storedSession.currentStep = this.currentIndex;
        if (this.currentIndex == tutorialGeneratorConfig.steps.length) {
            this.storedSession.completed = true;
        } else {
            this.storedSession.completed = false;
        }
        localStorage.setItem(STORED_SESSION_KEY, JSON.stringify(this.storedSession));
    }

    /**
     * Description placeholder
     * @date 11/29/2023 - 11:36:30 AM
     *
     * @param {DOMRect} rect
     * @param {StepConfig} step
     */
    render(rect, step) {
        /*
            const grayout = `
            <div id="tutorialDiv">
              <div id"tutorialText">
              ${step.text}
              </div>
            </div>
            <style>
              #tutorialDiv {
                position: absolute;
                height: ${this.pageHeight}px;
                width: ${this.pageWidth}px;
                border-style: solid;
                border-color: #ffffff60;
                border-width: ${rect.top + rect.height}px ${this.pageWidth - rect.left - rect.width}px ${this.pageHeight - rect.bottom - rect.height * 2}px ${rect.left}px;
                transition: .7s;
              }
            </style>
            `;
            */
        var footerHTML = '';
        if (step.showNextButton || step.showPrevButton) {
            footerHTML = '<div class="tutorial-footer">';
            if (step.showPrevButton) {
                footerHTML += '<button id="tutorialPrevBtn" class="tutorialPrevBtn btn" >PREV</button>'
            }
            if (step.showNextButton) {
                footerHTML += '<button id="tutorialNextBtn" class="tutorialNextBtn btn" >NEXT</button>'
            }
            footerHTML += '</div>'
        }
        const border = `
        <div class="tutorialDiv">
            <div id="tutorialHighlightDiv" class="tutorialHighlightDiv"></div>
            <div class="tutorialPop">
                <h2 class="tutorialPop-header">${step.title}</h3>
                <div class="tutorialPop-body">
                ${step.text}
                </div>
                ${footerHTML}
            </div>
        </div>
        <style>
            .tutorialDiv {
                position: absolute;
                top: ${rect.y}px;
                left: ${rect.x}px;
                z-index: 99999;
                display: flex;
            }
            .tutorialHighlightDiv{
                position: relative;
                height: ${rect.height}px;
                width: ${rect.width}px;
                top: 0px;
                left: 0px;
                transition: .7s;
                border-radius: .5rem;
                animation: pulse 1s linear infinite;
            }
              
            @keyframes pulse {
                0% {
                -moz-box-shadow: 0 0 0 0 #555555;
                box-shadow: 0 0 0 0 #555555;
                }
                70% {
                    -moz-box-shadow: 0 0 0 7px #555555;
                    box-shadow: 0 0 0 7px #555555;
                }
                100% {
                    -moz-box-shadow: 0 0 0 0 #555555;
                    box-shadow: 0 0 0 0 #555555;
                }
            }
            .tutorialPop {
                position: relative;
                /*left: ${rect.width}px;*/
                padding: 0px;
                width: 300px;
                background-color: white;
                border: 1px solid gray;
                border-radius: .5rem;
                margin-left: .5rem;
            }
    
            .tutorialPop-header{
                padding: .5rem 1rem;
                margin-top: 0px;
                margin-bottom: 0px;
                background-color: #eeeeee;
                border-bottom: 1px solid #dddddd;
                border-radius: .5rem;
            }
    
            .tutorialPop-body{
                padding: .5rem 1rem;
                border-radius: .5rem;
            }

            .tutorial-footer{
                padding: .5rem .7rem;
            }

            .tutorial-footer button{
                margin-right: .5rem;
            }

            .tutorial-footer button:last-child{
                margin-right: 0px;
            }
        </style>
      `;
        //this.shadow.innerHTML = border;
        this.innerHTML = border;

        if (step.showNextButton) {
            //this.shadow.getElementById('tutorialNextBtn')?.addEventListener("click", () => this.next(), { once: true });
            this.querySelector('#tutorialNextBtn')?.addEventListener("click", () => this.next(), { once: true });
        }
        if (step.showPrevButton) {
            //this.shadow.getElementById('tutorialPrevBtn')?.addEventListener("click", () => this.prev(), { once: true });
            this.querySelector('#tutorialPrevBtn')?.addEventListener("click", () => this.prev(), { once: true });
        }
    }

    reset() {
        //this.shadow.innerHTML = ``;
        this.innerHTML = ``;
    }
}

customElements.define('tutorial-generator', TutorialGenerator);
