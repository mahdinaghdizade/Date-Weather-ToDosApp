'use strict';

const $ = document;
const mainNavTemplate = $.createElement('template');
mainNavTemplate.innerHTML = `
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="./components/main-navigation/main-navigation.css">
<div id="mainNavCont">
    <div class="mainNavHeader">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path style="fill: #68c1e7" d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
        <svg style="display: none;" xmlns="http://www.w3.org/2000/svg" viewBox="0 40 384 512"><path style="fill: #68c1e7" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
        <slot name="navHeaderTitle"></slot>
    </div>
    <div class="mainNavBar">
        <ul>
            <li></li>
            <li class="navLink">Home</li>
            <li class="navLink">Weather</li>
            <li class="navLink">To-Dos</li>
            <li class="navLink">About Me</li>
        </ul>
    </div>
</div>
`;
class MainNav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(mainNavTemplate.content.cloneNode(true));
        this.btnToggle = false;
        this.themeColor = '#fff';
    }
    connectedCallback() {
        const compContainer = this.shadowRoot.querySelector('#mainNavCont');
        const menuBtns = this.shadowRoot.querySelectorAll('.mainNavHeader svg');
        const navHeader = this.shadowRoot.querySelector('.mainNavHeader');
        const navBar = this.shadowRoot.querySelector('.mainNavBar');
        const sideBar = $.querySelector('.sideBar');
        const direction = $.querySelector('main-nav-comp').getAttribute('data-direction');
        const activePage = $.querySelector('main-nav-comp').getAttribute('data-active-page').toLowerCase();
        const navListItems = Array.from(this.shadowRoot.querySelectorAll('.mainNavBar ul li'));
        const headerSvgs = this.shadowRoot.querySelectorAll('.mainNavHeader path');
        const navLinks = this.shadowRoot.querySelectorAll('.navLink');

        if (direction === 'left') {
            if (window.matchMedia('(min-width: 1101px)').matches) {
                compContainer.style.left = '0';
                navHeader.style.left = '0';
                menuBtns.forEach(btn => btn.style.left = '40px');
                navBar.style.left = '83px';
            }
        }
        let activeListItem = navListItems.filter(listItem => listItem.innerHTML.toLowerCase() === activePage);
        activeListItem[0].className = 'navLink active';
        menuBtns.forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                if (window.matchMedia("(max-width: 1100px)").matches) {
                    if (!this.btnToggle) {
                        btn.classList.add('svgBarAnimate');
                        setTimeout(() => {
                            navBar.style.top = '0';
                            this.btnToggle = true;
                        }, 10);
                        setTimeout(() => {
                            menuBtns[1].style.display = 'block';
                            btn.classList.remove('svgBarAnimate');
                            btn.style.display = 'none';
                        }, 370);
                    } else {
                        btn.classList.add('svgXAnimate');
                        navBar.style.top = '-450px';
                        this.btnToggle = false;
                        setTimeout(() => {
                            menuBtns[0].style.display = 'block';
                            btn.classList.remove('svgXAnimate');
                            btn.style.display = 'none';
                        }, 350);
                    }
                } else {
                    console.log(this.btnToggle);
                    // Codes for opening sidebar will go here ...
                    if (!this.btnToggle) {
                        if (sideBar) {
                            console.log('Entered');
                            sideBar.style.right = '0';
                            this.btnToggle = true;
                        }
                    }
                }
            });
        });
        $.body.addEventListener('click', (e) => {
            if (window.matchMedia('(max-width: 1100px)').matches) {
                if (e.pageY > 545) {
                    menuBtns[1].classList.add('svgXAnimate');
                    navBar.style.top = '-450px';
                    this.btnToggle = false;
                    setTimeout(() => {
                        menuBtns[0].style.display = 'block';
                        menuBtns[1].classList.remove('svgXAnimate');
                        menuBtns[1].style.display = 'none';
                    }, 350);
                }
            } else {
                if (e.pageX / window.innerWidth * 100 < 49) {
                    if (sideBar) {
                        sideBar.style.right = '-52%';
                        this.btnToggle = false;
                    }
                }
            }
        });
        window.addEventListener('resize', () => {
            if (window.matchMedia('(min-width: 1101px)').matches) {
                if (direction === 'left') {
                    compContainer.style.left = '0';
                    navHeader.style.left = '0';
                    menuBtns.forEach(btn => btn.style.left = '40px');
                    navBar.style.left = '83px';
                    headerSvgs.forEach(svg => svg.style.fill = '#fff');
                    navLinks.forEach(link => {
                        link.style.color = '#fff';
                        link.style.textShadow = 'black 0px 0px 5px';
                    });
                }/* else {
                    headerSvgs.forEach(svg => svg.style.fill = this.themeColor);
                    navLinks.forEach(link => link.style.color = this.themeColor);
                }*/
                this.setupLargeScreen();
            } else {
                if (direction === 'left') {
                    compContainer.style.left = 'initial';
                    compContainer.style.right = '0';
                    navHeader.style.left = '0';
                    menuBtns.forEach(btn => btn.style.left = 'clamp(20px, 9vw, 40px)');
                    navBar.style.left = '0';
                    headerSvgs.forEach(svg => svg.style.fill = this.themeColor);
                    navLinks.forEach(link => {
                        link.style.color = this.themeColor;
                        link.style.textShadow = 'none';
                    });
                }/* else {
                    headerSvgs.forEach(svg => svg.style.fill = this.themeColor);
                    navLinks.forEach(link => link.style.color = this.themeColor);
                }*/
                if (this.btnToggle) return;
                navBar.style.top = '-450px';
                menuBtns[0].style.display = 'block';
                menuBtns[1].style.display = 'none';
            }
            /////////////////////////////////////////////////////////////
            /*if (direction === 'left') {
                if (window.matchMedia('(min-width: 1101px)').matches) {
                    compContainer.style.left = '0';
                    navHeader.style.left = '0';
                    menuBtns.forEach(btn => btn.style.left = '40px');
                    navBar.style.left = '83px';

                } else {
                    compContainer.style.left = 'initial';
                    compContainer.style.right = '0';
                    navHeader.style.left = '0';
                    menuBtns.forEach(btn => btn.style.left = '40px');
                    navBar.style.left = '0';
                }
            }
            if (window.matchMedia("(min-width: 1101px)").matches) {
                this.setupLargeScreen();
            } else {
                if (this.btnToggle) return;
                navBar.style.top = '-450px';
                menuBtns[0].style.display = 'block';
                menuBtns[1].style.display = 'none';
            }*/
        });
        this.setSeasonState();
        if (window.matchMedia("(min-width: 1101px)").matches) {
            this.setupLargeScreen();
        }
    }
    setSeasonState() {
        let now = new Date();
        let currentMonth = now.getMonth();
        const headerSection = this.shadowRoot.querySelector('.mainNavHeader slot');
        const headerSvgs = this.shadowRoot.querySelectorAll('.mainNavHeader path');
        const navLinks = this.shadowRoot.querySelectorAll('.navLink');

        if (currentMonth === 2 || currentMonth === 3 || currentMonth === 4) {
            this.themeColor = '#82d000';
            giveStyle(this.themeColor);
            $.querySelector('main-nav-comp').setAttribute('data-season', 'spring');
        } else if (currentMonth === 5 || currentMonth === 6 || currentMonth === 7) {
            this.themeColor = '#269bbe';
            giveStyle(this.themeColor);
            $.querySelector('main-nav-comp').setAttribute('data-season', 'summer');
        } else if (currentMonth === 8 || currentMonth === 9 || currentMonth === 10) {
            this.themeColor = '#df712b';
            giveStyle(this.themeColor);
            $.querySelector('main-nav-comp').setAttribute('data-season', 'autumn');
        } else if (currentMonth === 11 || currentMonth === 0 || currentMonth === 1) {
            this.themeColor = '#0075e3';
            giveStyle(this.themeColor);
            $.querySelector('main-nav-comp').setAttribute('data-season', 'winter');
        }
        function giveStyle(themeColor) {
            const direction = $.querySelector('main-nav-comp').getAttribute('data-direction');
            headerSection.style.color = themeColor;
            headerSvgs.forEach(svg => {
                if (direction === 'left') {
                    if (window.matchMedia('(min-width: 1101px)').matches) {
                        svg.style.fill = '#fff';
                    } else {
                        svg.style.fill = themeColor;
                    }
                } else {
                    svg.style.fill = themeColor;
                }
            });
            navLinks.forEach(link => {
                if (direction === 'left') {
                    if (window.matchMedia('(min-width: 1101px)').matches) {
                        link.style.color = '#fff';
                        link.style.textShadow = 'black 0px 0px 5px';
                    } else {
                        link.style.color = themeColor;
                    }
                } else {
                    link.style.color = themeColor;
                }
                link.addEventListener('mouseenter', e => {
                    if (window.matchMedia('(max-width: 1100px)').matches) {
                        e.target.style.color = 'white';
                        e.target.style.backgroundColor = themeColor;
                    }
                });
                link.addEventListener('mouseleave', e => {
                    if (window.matchMedia('(max-width: 1100px)').matches) {
                        e.target.style.color = themeColor;
                        e.target.style.backgroundColor = 'transparent';
                    }
                });
            });
        }
    }
    setupLargeScreen() {
        const navBar = this.shadowRoot.querySelector('.mainNavBar');
        const menuBtns = this.shadowRoot.querySelectorAll('.mainNavHeader svg');
        const sideBar = $.querySelector('.sideBar');
        navBar.style.top = '0';
        this.btnToggle = false;
        menuBtns[0].style.display = 'block';
        menuBtns[1].style.display = 'none';
        if (sideBar) sideBar.style.right = '-52%';
    }
}
export { MainNav };