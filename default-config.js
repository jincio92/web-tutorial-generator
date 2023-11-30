var tutorialGeneratorConfig = {
    startFunction: () => { console.log("start"); },
    enable: true,
    steps: [
        {
            elementId: "test-1",
            title: "Title 1",
            text: "This is the first step and it's very important",
            preStep: () => { console.log('preStep 1'); },
            postStep: () => { console.log('postStep 1'); },
            nextAction: "click",
        },
        {
            elementId: "test-2",
            title: "Title 2",
            text: "This is the second step and it's also very important",
            preStep: () => { console.log('prestep 2'); },
            postStep: () => { console.log('postStep 2'); },
            nextAction: "click",
            showPrevButton: true,
            showNextButton: true
        },
        {
            elementId: "test-3",
            title: "Title 3",
            text: "This is the third step and it's not very important, but i need steps to test things",
            preStep: () => {  if(window.location.pathname != '/'){ window.location= '/';} console.log('prestep 3'); },
            postStep: () => { if(window.location.pathname != '/appuntamenti.html'){ window.location= '/appuntamenti.html';} console.log('postStep 3'); },
            nextAction: "none",
            showPrevButton: true,
            showNextButton: true
        },
        {
            elementId: "test-4",
            title: "Title 4",
            text: "This is the fourth step and it's not very important, but i need steps to test things. Also, it's in another page!",
            preStep: () => { console.log('prestep 4'); },
            postStep: () => { console.log('postStep 4'); },
            nextAction: "none",
            showPrevButton: true,
            showNextButton: true
        }]
}
