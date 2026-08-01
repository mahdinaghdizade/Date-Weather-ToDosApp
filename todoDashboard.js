'use strict';

import {auth, provider} from "./todoApp.js";
import {
    MainNav as mainNav
} from "./components/main-navigation/main-navigation.js";

const $ = document;
const userCookieData = {
    id: ($.cookie.slice(11, -1)).split(',')[0],
    email: ($.cookie.slice(11, -1)).split(',')[1],
    name: ($.cookie.slice(11, -1)).split(',')[2],
    proPic: ($.cookie.slice(11, -1)).split(',')[3],
};
const dbReferenceURL = 'https://todolist-by-gauss-default-rtdb.asia-southeast1.firebasedatabase.app/';
window.customElements.define('main-nav-comp', mainNav);

/* Variables */
class ToDoApp {
///////////////////////////////////////////////////////////////////////////////
    constructor() {
        // Variables
        this.projDropBtn = $.querySelector('#headerCon .dropdown button');
        this.profileDropBtn = $.querySelector('#profileCon .circle');
        this.profModalCopyBtn = $.querySelector('#profileCon .profModal .details .email svg');
        this.logoutBtn = $.querySelector('#profileCon .profModal .logoutBtn');
        this.todoMenuCon = $.querySelector('#todoMenuCon');
        this.toDoMenuNewBtn = $.querySelector('#todoMenuCon .todoMenu li:nth-child(3)');
        this.mainCon = $.querySelector('#mainCon');
        // Method Calls
        this.setCoverBgHue();
        this.setProfile();
        this.closeProjModal = this.closeProjModal.bind(this);
        this.closeProfileModal = this.closeProfileModal.bind(this);
        this.closeNewModal = this.closeNewModal.bind(this);
        // Call after loading data from Google
        //this.setActiveProj();

        // Event Listeners
        this.projDropBtn.addEventListener('click', () => {
            const svg = $.querySelector('#headerCon .dropdown button svg');
            const projectsBox = $.querySelector('#headerCon .dropdown div');
            let modalIsOpen;
            const svgStat = (window.getComputedStyle(svg).transform).split('').join('');
            (svgStat === 'matrix(1, 0, 0, 1, 0, 0)') ? modalIsOpen = false : modalIsOpen = true;
            if (!modalIsOpen) {
                //Show the projects box
                this.mainCon.classList.toggle('z-1');
                this.mainCon.classList.toggle('-z-1');
                this.todoMenuCon.classList.toggle('z-3');
                this.todoMenuCon.classList.toggle('-z-1');
                setTimeout(() => {
                    svg.classList.toggle('transform-[matrix(1,0,0,1,0,0)]');
                    svg.classList.toggle('transform-[matrix(-1,0,0,-1,0,0)]');
                    projectsBox.classList.toggle('h-0');
                    projectsBox.classList.toggle('h-[160px]');
                }, 250);
                window.addEventListener('click', this.closeProjModal);
            } else {
                svg.classList.toggle('transform-[matrix(-1,0,0,-1,0,0)]');
                svg.classList.toggle('transform-[matrix(1,0,0,1,0,0)]');
                // Hide the projects box
                projectsBox.classList.toggle('h-[160px]');
                projectsBox.classList.toggle('h-0');
                setTimeout(() => {
                    this.mainCon.classList.toggle('-z-1');
                    this.mainCon.classList.toggle('z-1');
                    this.todoMenuCon.classList.toggle('-z-1');
                    this.todoMenuCon.classList.toggle('z-3');
                }, 300);
                window.removeEventListener('click', this.closeProjModal);
            }

        });
        this.profileDropBtn.addEventListener('click', () => {
            const profileBox = $.querySelector('#profileCon .profModal');
            const boxIsOpen = profileBox.classList.contains('flex');
            if (!boxIsOpen) {
                this.todoMenuCon.classList.toggle('z-3');
                this.todoMenuCon.classList.toggle('-z-1');
                this.mainCon.classList.toggle('z-1');
                this.mainCon.classList.toggle('-z-1');
                profileBox.classList.toggle('hidden');
                profileBox.classList.toggle('flex');
                setTimeout(() => {
                    profileBox.classList.toggle('opacity-0');
                    profileBox.classList.toggle('opacity-100');
                }, 20);
                window.addEventListener('click', this.closeProfileModal);
            } else {
                profileBox.classList.toggle('opacity-100');
                profileBox.classList.toggle('opacity-0');
                setTimeout(() => {
                    profileBox.classList.toggle('flex');
                    profileBox.classList.toggle('hidden');
                    this.todoMenuCon.classList.toggle('-z-1');
                    this.todoMenuCon.classList.toggle('z-3');
                    this.mainCon.classList.toggle('-z-1');
                    this.mainCon.classList.toggle('z-1');
                }, 300);
                window.removeEventListener('click', this.closeProfileModal);
            }
        });
        this.profModalCopyBtn.addEventListener('click', () => {
            const mail = $.querySelector('#profileCon .profModal .details .email span:first-child');
            window.navigator.clipboard.writeText(mail.innerText)
                .then(res => {
                    console.log('Copied!');
                })
                .catch(err => {
                    console.log('Error has occured while copying: ', err);
                });
        });
        this.logoutBtn.addEventListener('click', () => {
            auth.signOut()
                .then(() => {
                    // Sign-out successful.
                    console.log('Sign-out successful: ');
                    location.href = './todoDashboard.html';
                })
                .catch(error => {
                    // An error happened.
                    console.log('An error happened.', error);
                });
        });
        window.addEventListener('scroll', e => {
            //console.log(e.target.scrollingElement.scrollTop);
            let scrollTopV = e.target.scrollingElement.scrollTop;
            if (scrollTopV >= 100) {
                scrollTopV = 100;
                window.scrollTo({ top: 100, behavior: 'smooth' });
            }
            $.documentElement.style.setProperty('--topMenuHeight', `${200 - scrollTopV}px`);
        });
        this.toDoMenuNewBtn.addEventListener('click', event => {
            const newModal = $.querySelector('#todoMenuCon .todoMenu li:nth-child(3) div.modal');
            if (event.target.closest('#todoMenuCon .todoMenu li:nth-child(3) div.modal')) {
                return;
            }
            const boxIsOpen = newModal.classList.contains('block');
            if (!boxIsOpen) {
                newModal.classList.toggle('hidden');
                newModal.classList.toggle('block');
                this.mainCon.classList.toggle('z-1');
                this.mainCon.classList.toggle('-z-1');
                setTimeout(() => {
                    newModal.classList.toggle('h-0');
                    newModal.classList.toggle('h-[97px]');
                }, 50);
                window.addEventListener('click', this.closeNewModal);
            } else {
                newModal.classList.toggle('h-[97px]');
                newModal.classList.toggle('h-0');
                setTimeout(() => {
                    newModal.classList.toggle('block');
                    newModal.classList.toggle('hidden');
                    this.mainCon.classList.toggle('-z-1');
                    this.mainCon.classList.toggle('z-1');
                }, 300);
                window.removeEventListener('click', this.closeNewModal);
            }
        });
    }

    ///////////////////////////////////////////////////////////////////////////
    //------------------------------- Methods -------------------------------//
    ///////////////////////////////////////////////////////////////////////////
    closeProjModal(event) {
        const svg = $.querySelector('#headerCon .dropdown button svg');
        const projectsBox = $.querySelector('#headerCon .dropdown div');
        if (!event.target.closest('#headerCon .dropdown')) {
            svg.classList.toggle('transform-[matrix(-1,0,0,-1,0,0)]');
            svg.classList.toggle('transform-[matrix(1,0,0,1,0,0)]');
            projectsBox.classList.toggle('h-[160px]');
            projectsBox.classList.toggle('h-0');
            window.removeEventListener('click', this.closeProjModal);
            setTimeout(() => {
                this.mainCon.classList.toggle('-z-1');
                this.mainCon.classList.toggle('z-1');
                this.todoMenuCon.classList.toggle('-z-1');
                this.todoMenuCon.classList.toggle('z-3');
            }, 300);
        }
    }
    closeProfileModal(event) {
        const profileBox = $.querySelector('#profileCon .profModal');
        if ((!event.target.closest('#profileCon .profModal')) && (!event.target.closest('#profileCon .circle'))) {
            profileBox.classList.toggle('opacity-100');
            profileBox.classList.toggle('opacity-0');
            setTimeout(() => {
                profileBox.classList.toggle('flex');
                profileBox.classList.toggle('hidden');
                this.todoMenuCon.classList.toggle('-z-1');
                this.todoMenuCon.classList.toggle('z-3');
                this.mainCon.classList.toggle('-z-1');
                this.mainCon.classList.toggle('z-1');
            }, 300);
            window.removeEventListener('click', this.closeProfileModal);
        }
    }
    setCoverBgHue() {
        const season = $.querySelector('main-nav-comp').getAttribute('data-season');
        //const bgImg = $.getElementById('topCoverImg');
        switch(season) {
            case 'spring':
                $.documentElement.style.setProperty('--coverBgHue', '310deg');
                $.documentElement.style.setProperty('--color-themeColor', '#82d000');
                break;
            case 'summer':
                $.documentElement.style.setProperty('--coverBgHue', '10deg');
                $.documentElement.style.setProperty('--color-themeColor', '#269bbe');
                break;
            case 'autumn':
                $.documentElement.style.setProperty('--coverBgHue', '190deg');
                $.documentElement.style.setProperty('--color-themeColor', '#df712b');
                break;
            case 'winter':
                $.documentElement.style.setProperty('--coverBgHue', '35deg');
                $.documentElement.style.setProperty('--color-themeColor', '#0075e3');
                break;
            default:
                break;
        }
    }
    setProfile() {
        const proPicCont = $.querySelector('#profileCon .circle');
        const proPicElem = $.createElement('img');
        const proName = $.querySelector('#profileCon .profModal .details .name');
        const proMail = $.querySelector('#profileCon .profModal .details .email span:first-child');
        proPicElem.setAttribute('src', userCookieData.proPic);
        proPicElem.setAttribute('alt', 'User Profile');
        proPicElem.setAttribute('class', 'size-[102%] -translate-x-1/100 -translate-y-1/100');
        //proPicElem.setAttribute('crossorigin', 'anonymous');
        proPicElem.addEventListener('load', () => {
            proPicCont.appendChild(proPicElem);
        });
        proName.innerText = (userCookieData.name) ? userCookieData.name : 'No Name found. Sign In again.';
        proMail.innerText = (userCookieData.email) ? userCookieData.email : 'No Email found. Sign In again.';
    }
    closeNewModal(event) {
        const newModal = $.querySelector('#todoMenuCon .todoMenu li:nth-child(3) div.modal');
        if ((!event.target.closest('#todoMenuCon .todoMenu li:nth-child(3) div.modal')) && (!event.target.closest('#todoMenuCon .todoMenu li:nth-child(3)')) && (!event.target.closest('#todoMenuCon .todoMenu li:nth-child(3) div.overlay'))) {
            newModal.classList.toggle('h-[97px]');
            newModal.classList.toggle('h-0');
            setTimeout(() => {
                newModal.classList.toggle('block');
                newModal.classList.toggle('hidden');
                this.mainCon.classList.toggle('-z-1');
                this.mainCon.classList.toggle('z-1');
            }, 300);
            window.removeEventListener('click', this.closeNewModal);
        }
    }
    setActiveProj() {
        // You should've set the last used project, and show it when the user
        // comes to the projects.
    }
///////////////////////////////////////////////////////////////////////////////
}

let toDoApp = new ToDoApp();
