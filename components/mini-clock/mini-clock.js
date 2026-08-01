const $ = document;
const template = $.createElement('template');
template.innerHTML = `
<link rel="stylesheet" type="text/css" href="./components/mini-clock/mini-clock.css">
<div id="clock">
    <div id="hourHand" class="hand"></div>
    <div id="minuteHand" class="hand"></div>
    <div id="secondHand" class="hand"></div>
    <div id="center"></div>
    <div class="littleVLine"></div>
    <div id="hour3">
        <span>03</span>
        <div class="littleHLine"></div>
    </div>
    <div class="littleVLine"></div>
    <div id="hour9">
        <span>09</span>
        <div class="littleHLine"></div>
    </div>
</div>
`;

class MiniClock extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        const hands = this.shadowRoot.querySelectorAll('.hand');
        const hour = hands[0];
        const minute = hands[1];
        const second = hands[2];
        setInterval(() => {
            this.updateClock(hour, minute, second);
        }, 10);
    }
    updateClock(hour, minute, second) {
        let now = new Date();
        let getHour = now.getHours();
        let getMinute = now.getMinutes();
        let getSecond = now.getSeconds();
        let getMillisecond = now.getMilliseconds();
        if (getHour > 12) getHour -= 12;
        hour.style.transform = `translate(-50%, -50%) rotate(${getHour * 30 + (getMinute * 0.5)}deg`;
        minute.style.transform = `translate(-50%, -50%) rotate(${getMinute * 6 + (getSecond * 0.1)}deg`;
        second.style.transform = `translate(-50%, -50%) rotate(${getSecond * 6 + (getMillisecond * 0.006)}deg`;
    }
}

export { MiniClock };

/*
const hands = $.querySelectorAll('.hand');
const hour = hands[0];
const minute = hands[1];
const second = hands[2];
function updateClock() {
    let now = new Date();
    let getHour = now.getHours();
    let getMinute = now.getMinutes();
    let getSecond = now.getSeconds();
    let getMillisecond = now.getMilliseconds();
    if (getHour > 12) getHour -= 12;
    hour.style.transform = `translate(-50%, -50%) rotate(${getHour * 30 + (getMinute * 0.5)}deg`;
    minute.style.transform = `translate(-50%, -50%) rotate(${getMinute * 6 + (getSecond * 0.1)}deg`;
    second.style.transform = `translate(-50%, -50%) rotate(${getSecond * 6 + (getMillisecond * 0.006)}deg`;
}
setInterval(updateClock, 10);
*/