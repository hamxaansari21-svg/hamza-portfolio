import { app } from "./firebase-config.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================
   FIREBASE
========================================= */

const db = getFirestore(app);

const portfolioRef = doc(
    db,
    "portfolio",
    "content"
);


/* =========================================
   DOM ELEMENTS
========================================= */

const nameElements =
    document.querySelectorAll(".name");

const typingElement =
    document.querySelector(".typing");

const heroDescription =
    document.querySelector(".hero-description");

const aboutElement =
    document.querySelector("#about-text");

const skillsContainer =
    document.querySelector(".skills-container");

const projectsContainer =
    document.querySelector(".projects-container");

const emailLinks =
    document.querySelectorAll(
        'a[href^="mailto:"]'
    );

const githubLinks =
    document.querySelectorAll(
        'a[href*="github.com"]'
    );

const linkedinLinks =
    document.querySelectorAll(
        'a[href*="linkedin.com"]'
    );

const resumeLinks =
    document.querySelectorAll(
        ".resume-btn"
    );


/* =========================================
   TYPING ANIMATION
========================================= */

let roles = [
    "College Student",
    "Python Developer",
    "Web Developer",
    "Future Software Engineer"
];

let roleIndex = 0;
let characterIndex = 0;
let deleting = false;


function typeEffect() {

    if (!typingElement || roles.length === 0) {
        return;
    }

    const currentRole =
        roles[roleIndex];


    if (!deleting) {

        typingElement.textContent =
            currentRole.substring(
                0,
                characterIndex + 1
            );

        characterIndex++;


        if (
            characterIndex ===
            currentRole.length
        ) {

            deleting = true;

            setTimeout(
                typeEffect,
                1500
            );

            return;
        }


        setTimeout(
            typeEffect,
            100
        );

    } else {

        typingElement.textContent =
            currentRole.substring(
                0,
                characterIndex - 1
            );

        characterIndex--;


        if (characterIndex === 0) {

            deleting = false;

            roleIndex++;

            if (
                roleIndex >=
                roles.length
            ) {

                roleIndex = 0;

            }

            setTimeout(
                typeEffect,
                300
            );

            return;
        }


        setTimeout(
            typeEffect,
            60
        );

    }

}


/* =========================================
   START TYPING
========================================= */

typeEffect();


/* =========================================
   LOAD FIREBASE DATA
========================================= */

async function loadPortfolio() {

    try {

        const snapshot =
            await getDoc(
                portfolioRef
            );


        if (!snapshot.exists()) {

            console.log(
                "Portfolio data not found."
            );

            return;
        }


        const data =
            snapshot.data();


        /* =====================================
           NAME
        ===================================== */

        if (data.fullName) {

            nameElements.forEach(
                element => {

                    element.textContent =
                        data.fullName;

                }
            );

        }


        /* =====================================
           TYPING ROLES
        ===================================== */

        if (
            Array.isArray(
                data.typingRoles
            ) &&
            data.typingRoles.length > 0
        ) {

            roles =
                data.typingRoles;

            roleIndex = 0;
            characterIndex = 0;
            deleting = false;

        }


        /* =====================================
           HERO DESCRIPTION
        ===================================== */

        if (
            data.heroDescription &&
            heroDescription
        ) {

            heroDescription.textContent =
                data.heroDescription;

        }


        /* =====================================
           ABOUT
        ===================================== */

        if (
            data.about &&
            aboutElement
        ) {

            aboutElement.textContent =
                data.about;

        }


        /* =====================================
           SKILLS
        ===================================== */

        if (
            Array.isArray(data.skills) &&
            skillsContainer
        ) {

            skillsContainer.innerHTML = "";

            data.skills.forEach(
                skill => {

                    const skillElement =
                        document.createElement(
                            "span"
                        );

                    skillElement.textContent =
                        skill;

                    skillsContainer.appendChild(
                        skillElement
                    );

                }
            );

        }


        /* =====================================
           PROJECTS
        ===================================== */

        if (
            Array.isArray(data.projects) &&
            projectsContainer
        ) {

            projectsContainer.innerHTML = "";

            data.projects.forEach(
                project => {

                    createProjectCard(
                        project
                    );

                }
            );

        }


        /* =====================================
           EMAIL
        ===================================== */

        if (data.email) {

            emailLinks.forEach(
                link => {

                    link.href =
                        `mailto:${data.email}`;

                }
            );

        }


        /* =====================================
           GITHUB
        ===================================== */

        if (data.github) {

            githubLinks.forEach(
                link => {

                    link.href =
                        data.github;

                    link.target =
                        "_blank";

                    link.rel =
                        "noopener noreferrer";

                }
            );

        }


        /* =====================================
           LINKEDIN
        ===================================== */

        if (data.linkedin) {

            linkedinLinks.forEach(
                link => {

                    link.href =
                        data.linkedin;

                    link.target =
                        "_blank";

                    link.rel =
                        "noopener noreferrer";

                }
            );

        }


        /* =====================================
           RESUME
        ===================================== */

        if (data.resume) {

            resumeLinks.forEach(
                link => {

                    link.href =
                        data.resume;

                    link.download = "";

                }
            );

        }


    } catch (error) {

        console.error(
            "Error loading portfolio:",
            error
        );

    }

}


/* =========================================
   CREATE PROJECT CARD
========================================= */

function createProjectCard(project) {

    if (!projectsContainer) {
        return;
    }


    /* =====================================
       CARD
    ===================================== */

    const card =
        document.createElement("div");

    card.className =
        "project-card";


    /* =====================================
       PROJECT URL
    ===================================== */

    const projectUrl =
        typeof project.projectUrl === "string"
            ? project.projectUrl.trim()
            : "";


    /*
       Check whether project URL is valid
       before making the card clickable.
    */

    const validProjectUrl =
        isValidWebUrl(projectUrl);


    /* =====================================
       MAKE CARD CLICKABLE
    ===================================== */

    if (validProjectUrl) {

        card.classList.add(
            "clickable"
        );

        card.setAttribute(
            "role",
            "link"
        );

        card.setAttribute(
            "tabindex",
            "0"
        );

        card.setAttribute(
            "aria-label",
            `Open ${project.title || "project"}`
        );


        card.addEventListener(
            "click",
            () => {

                openExternalLink(
                    projectUrl
                );

            }
        );


        card.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    openExternalLink(
                        projectUrl
                    );

                }

            }
        );

    }


    /* =====================================
       PROJECT TITLE
    ===================================== */

    const title =
        document.createElement("h3");

    title.textContent =
        project.title ||
        "Project";


    card.appendChild(
        title
    );


    /* =====================================
       PROJECT DESCRIPTION
    ===================================== */

    const description =
        document.createElement("p");

    description.textContent =
        project.description ||
        "";


    card.appendChild(
        description
    );


    /* =====================================
       TECHNOLOGY TAGS
    ===================================== */

    if (
        Array.isArray(
            project.tags
        ) &&
        project.tags.length > 0
    ) {

        const tagsContainer =
            document.createElement("div");

        tagsContainer.className =
            "project-tags";


        project.tags.forEach(
            tag => {

                /* =========================
                   NEW TAG FORMAT
                =========================

                   {
                       name: "HTML",
                       url: "https://..."
                   }
                */

                if (
                    typeof tag === "object" &&
                    tag !== null
                ) {

                    const tagName =
                        typeof tag.name === "string"
                            ? tag.name.trim()
                            : "";

                    const tagUrl =
                        typeof tag.url === "string"
                            ? tag.url.trim()
                            : "";


                    if (!tagName) {
                        return;
                    }


                    /* =====================
                       CLICKABLE TAG
                    ===================== */

                    if (
                        isValidWebUrl(tagUrl)
                    ) {

                        const tagLink =
                            document.createElement(
                                "a"
                            );

                        tagLink.textContent =
                            tagName;

                        tagLink.href =
                            tagUrl;

                        tagLink.target =
                            "_blank";

                        tagLink.rel =
                            "noopener noreferrer";

                        tagLink.className =
                            "project-tag-link";

                        tagLink.setAttribute(
                            "aria-label",
                            `Open ${tagName} code`
                        );


                        /*
                           Stop the click from
                           opening the project card.
                        */

                        tagLink.addEventListener(
                            "click",
                            event => {

                                event.stopPropagation();

                            }
                        );


                        tagLink.addEventListener(
                            "keydown",
                            event => {

                                event.stopPropagation();

                            }
                        );


                        tagsContainer.appendChild(
                            tagLink
                        );

                    }


                    /* =====================
                       NORMAL TAG
                    ===================== */

                    else {

                        const tagElement =
                            document.createElement(
                                "span"
                            );

                        tagElement.textContent =
                            tagName;

                        tagsContainer.appendChild(
                            tagElement
                        );

                    }

                }


                /* =================================
                   OLD TAG FORMAT

                   Example:

                   "HTML"
                ================================= */

                else if (
                    typeof tag === "string"
                ) {

                    const tagName =
                        tag.trim();


                    if (!tagName) {
                        return;
                    }


                    const tagElement =
                        document.createElement(
                            "span"
                        );

                    tagElement.textContent =
                        tagName;

                    tagsContainer.appendChild(
                        tagElement
                    );

                }

            }
        );


        card.appendChild(
            tagsContainer
        );

    }


    /* =====================================
       VIEW PROJECT BUTTON
    ===================================== */

    if (validProjectUrl) {

        const projectButton =
            document.createElement("a");

        projectButton.href =
            projectUrl;

        projectButton.target =
            "_blank";

        projectButton.rel =
            "noopener noreferrer";

        projectButton.className =
            "project-view-button";

        projectButton.innerHTML =
            `View Project <span aria-hidden="true">↗</span>`;


        /*
           Important:

           The button has its own link,
           so clicking it should not
           trigger the card click.
        */

        projectButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

            }
        );


        projectButton.addEventListener(
            "keydown",
            event => {

                event.stopPropagation();

            }
        );


        card.appendChild(
            projectButton
        );

    }


    /* =====================================
       ADD CARD TO PAGE
    ===================================== */

    projectsContainer.appendChild(
        card
    );

}


/* =========================================
   URL VALIDATION
========================================= */

function isValidWebUrl(url) {

    if (!url) {
        return false;
    }


    try {

        const parsedUrl =
            new URL(url);


        return (
            parsedUrl.protocol === "http:" ||
            parsedUrl.protocol === "https:"
        );

    } catch (error) {

        return false;

    }

}


/* =========================================
   OPEN EXTERNAL LINK
========================================= */

function openExternalLink(url) {

    if (!isValidWebUrl(url)) {

        console.error(
            "Invalid project URL:",
            url
        );

        return;

    }


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================
   LOAD PORTFOLIO
========================================= */

loadPortfolio();