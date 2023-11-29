
/**
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
 * @date 11/29/2023 - 10:04:33 AM
 *
 * @typedef {Object} TutorialConfig - 
 * @property {() => void} startFunction - 
 * @property {StepConfig[]} steps - 
 * @property {boolean} enable - 
 */

/**
 * Description placeholder
 * @date 11/29/2023 - 10:04:39 AM
 *
 * @class TutorialGenerator
 * @typedef {TutorialGenerator}
 * @extends {HTMLElement}
 */
class TutorialGenerator extends HTMLElement {
    currentIndex = 0;
    pageWidth = 0;
    pageHeight = 0;

    constructor() {
        super();
        if (!config || !config.enable) return;
        this.shadow = this.attachShadow({ mode: 'closed' });
        document.addEventListener("DOMContentLoaded", () => {
            //window.addEventListener("load", () => {
            this.pageWidth = document.body.scrollWidth;
            this.pageHeight = document.body.scrollHeight;
            config.startFunction();
            setTimeout(() => {
                this.executeStep(config.steps[this.currentIndex]);
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
                this.shadow.getElementById('tutorialHighlightDiv').addEventListener('click', () => { this.postStep(step) }, { once: true });;
            }
        }
    }

    postStep(step) {
        this.reset();
        step.postStep?.call();
        if (config.steps[this.currentIndex + 1]) {
            this.currentIndex++;
            this.executeStep(config.steps[this.currentIndex]);
        }
    }

    prev() {
        this.currentIndex--;
        if (this.currentIndex >= 0)
            this.executeStep(config.steps[this.currentIndex]);
    }

    next() {
        this.postStep(config.steps[this.currentIndex]);
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
                footerHTML += '<button id="tutorialPrevBtn" class="tutorialPrevBtn" >PREV</button>'
            }
            if (step.showNextButton) {
                footerHTML += '<button id="tutorialNextBtn" class="tutorialNextBtn" >NEXT</button>'
            }
            footerHTML += '</div>'
        }
        const border = `
        <div class="tutorialDiv">
            <div id="tutorialHighlightDiv" class="tutorialHighlightDiv"></div>
            <div class="tutorialPop">
                <h3 class="tutorialPop-header">${step.title}</h3>
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
                z-index:999;
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
                width: 200px;
                background-color: white;
                border: 1px solid gray;
                border-radius: .5rem;
                margin-left: .5rem;
            }
    
            .tutorialPop-header{
                padding: .5rem 1rem;
                margin-top: 0px;
                margin-bottom: 0px;
                font-size: 1rem;
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
        </style>
      `;
        this.shadow.innerHTML = border;

        if (step.showNextButton) {
            this.shadow.getElementById('tutorialNextBtn')?.addEventListener("click", () => this.next(), { once: true });
        }
        if (step.showPrevButton) {
            this.shadow.getElementById('tutorialPrevBtn')?.addEventListener("click", () => this.prev(), { once: true });
        }
    }

    reset() {
        this.shadow.innerHTML = ``;
    }
}

customElements.define('tutorial-generator', TutorialGenerator);
