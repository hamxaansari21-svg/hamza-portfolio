import { app } from "./firebase-config.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================================
   FIREBASE
========================================================= */

const auth = getAuth(app);
const db = getFirestore(app);

const portfolioRef = doc(db, "portfolio", "content");

const ADMIN_UID = "FPEeb5a0qqQNplQvJX9DX0Hjegt1";


/* =========================================================
   LOGIN ELEMENTS
========================================================= */

const loginSection =
    document.getElementById("login-section");

const dashboard =
    document.getElementById("dashboard");

const loginForm =
    document.getElementById("login-form");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginMessage =
    document.getElementById("login-message");

const logoutButton =
    document.getElementById("logout-button");


/* =========================================================
   PORTFOLIO ELEMENTS
========================================================= */

const fullNameInput =
    document.getElementById("full-name");

const typingRolesInput =
    document.getElementById("typing-roles");

const heroDescriptionInput =
    document.getElementById("hero-description");

const aboutInput =
    document.getElementById("about-me");

const skillsInput =
    document.getElementById("skills");

const contactEmailInput =
    document.getElementById("contact-email");

const githubInput =
    document.getElementById("github");

const linkedinInput =
    document.getElementById("linkedin");

const resumeInput =
    document.getElementById("resume");


/* =========================================================
   PROJECT ELEMENTS
========================================================= */

const projectEditor =
    document.getElementById("project-editor");

const projectFormHeading =
    document.getElementById("project-form-heading");

const projectTitleInput =
    document.getElementById("project-title");

const projectDescriptionInput =
    document.getElementById("project-description");

const projectUrlInput =
    document.getElementById("project-url");

const tagLinksContainer =
    document.getElementById("tag-links-container");

const addTagButton =
    document.getElementById("add-tag-button");

const addProjectButton =
    document.getElementById("add-project-button");

const saveProjectButton =
    document.getElementById("save-project-button");

const cancelProjectButton =
    document.getElementById("cancel-project-button");

const projectsList =
    document.getElementById("projects-list");

const saveButton =
    document.getElementById("save-button");


/* =========================================================
   PROJECT DATA
========================================================= */

let projects = [];

let editingProjectIndex = -1;


/* =========================================================
   HELPER
========================================================= */

function showMessage(message, type = "success") {

    if (!loginMessage) return;

    loginMessage.textContent = message;

    loginMessage.className = "";

    loginMessage.classList.add(type);

}


/* =========================================================
   PASSWORD EYE TOGGLE
========================================================= */

const togglePassword =
    document.getElementById("toggle-password");

if (togglePassword && passwordInput) {

    togglePassword.addEventListener(
        "click",
        () => {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                togglePassword.textContent = "🙈";

                togglePassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

                togglePassword.setAttribute(
                    "aria-pressed",
                    "true"
                );

            } else {

                passwordInput.type = "password";

                togglePassword.textContent = "👁";

                togglePassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

                togglePassword.setAttribute(
                    "aria-pressed",
                    "false"
                );

            }

        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    if (!value) return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   ADD TECHNOLOGY ROW
========================================================= */

function addTagRow(name = "", url = "") {

    if (!tagLinksContainer) return;


    const row =
        document.createElement("div");

    row.className =
        "tag-link-row";


    row.innerHTML = `
        <input
            type="text"
            class="tag-name-input"
            placeholder="Technology name (e.g. HTML)"
            value="${escapeHtml(name)}"
        >

        <input
            type="url"
            class="tag-url-input"
            placeholder="Code URL (e.g. GitHub file link)"
            value="${escapeHtml(url)}"
        >

        <button
            type="button"
            class="remove-tag-button">
            Remove
        </button>
    `;


    const removeButton =
        row.querySelector(
            ".remove-tag-button"
        );


    if (removeButton) {

        removeButton.addEventListener(
            "click",
            () => {

                row.remove();

                updateProjectPreview();

            }
        );

    }


    tagLinksContainer.appendChild(row);

    updateProjectPreview();

}


/* =========================================================
   ADD TECHNOLOGY BUTTON
========================================================= */

if (addTagButton) {

    addTagButton.addEventListener(
        "click",
        () => {

            addTagRow();

        }
    );

}


/* =========================================================
   GET TECHNOLOGY DATA
========================================================= */

function getTagData() {

    if (!tagLinksContainer) return [];


    const rows =
        tagLinksContainer.querySelectorAll(
            ".tag-link-row"
        );


    const tags = [];


    rows.forEach(row => {

        const nameInput =
            row.querySelector(
                ".tag-name-input"
            );

        const urlInput =
            row.querySelector(
                ".tag-url-input"
            );


        const name =
            nameInput
                ? nameInput.value.trim()
                : "";


        const url =
            urlInput
                ? urlInput.value.trim()
                : "";


        if (name) {

            tags.push({
                name: name,
                url: url
            });

        }

    });


    return tags;

}


/* =========================================================
   CLEAR TECHNOLOGY ROWS
========================================================= */

function clearTagRows() {

    if (!tagLinksContainer) return;

    tagLinksContainer.innerHTML = "";

}


/* =========================================================
   RESET PROJECT FORM
========================================================= */

function resetProjectForm() {

    editingProjectIndex = -1;


    if (projectTitleInput) {

        projectTitleInput.value = "";

    }


    if (projectDescriptionInput) {

        projectDescriptionInput.value = "";

    }


    if (projectUrlInput) {

        projectUrlInput.value = "";

    }


    clearTagRows();


    if (projectFormHeading) {

        projectFormHeading.textContent =
            "Add New Project";

    }


    if (saveProjectButton) {

        saveProjectButton.textContent =
            "Save Project";

    }


    if (cancelProjectButton) {

        cancelProjectButton.style.display =
            "inline-block";

    }


    updateProjectPreview();

}


/* =========================================================
   OPEN PROJECT EDITOR
========================================================= */

function openProjectEditor() {

    if (!projectEditor) return;


    projectEditor.classList.add("active");


    setTimeout(() => {

        projectEditor.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

}


/* =========================================================
   CLOSE PROJECT EDITOR
========================================================= */

function closeProjectEditor() {

    if (!projectEditor) return;

    projectEditor.classList.remove("active");

}


/* =========================================================
   ADD PROJECT
========================================================= */

if (addProjectButton) {

    addProjectButton.addEventListener(
        "click",
        () => {

            resetProjectForm();

            openProjectEditor();

        }
    );

}


/* =========================================================
   CANCEL PROJECT
========================================================= */

if (cancelProjectButton) {

    cancelProjectButton.addEventListener(
        "click",
        () => {

            resetProjectForm();

            closeProjectEditor();

        }
    );

}


/* =========================================================
   LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            if (!email || !password) {

                showMessage(
                    "Please enter email and password.",
                    "error"
                );

                return;

            }


            try {

                showMessage(
                    "Logging in...",
                    "success"
                );


                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                if (user.uid !== ADMIN_UID) {

                    await signOut(auth);


                    showMessage(
                        "You are not authorized as admin.",
                        "error"
                    );

                    return;

                }


                showMessage(
                    "Login successful!",
                    "success"
                );


            } catch (error) {

                console.error(error);


                showMessage(
                    "Login failed. Check your email and password.",
                    "error"
                );

            }

        }
    );

}


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (
            user &&
            user.uid === ADMIN_UID
        ) {

            if (loginSection) {

                loginSection.style.display =
                    "none";

            }


            if (dashboard) {

                dashboard.style.display =
                    "block";

            }


            await loadPortfolio();

        } else {

            if (loginSection) {

                loginSection.style.display =
                    "block";

            }


            if (dashboard) {

                dashboard.style.display =
                    "none";

            }

        }

    }
);


/* =========================================================
   LOAD PORTFOLIO
========================================================= */

async function loadPortfolio() {

    try {

        const snapshot =
            await getDoc(portfolioRef);


        if (!snapshot.exists()) {

            projects = [];

            renderProjects();

            return;

        }


        const data =
            snapshot.data();


        /* BASIC INFORMATION */

        if (fullNameInput) {

            fullNameInput.value =
                data.fullName || "";

        }


        if (typingRolesInput) {

            typingRolesInput.value =
                Array.isArray(data.typingRoles)
                    ? data.typingRoles.join("\n")
                    : "";

        }


        if (heroDescriptionInput) {

            heroDescriptionInput.value =
                data.heroDescription || "";

        }


        if (aboutInput) {

            aboutInput.value =
                data.about ||
                data.aboutMe ||
                "";

        }


        if (skillsInput) {

            skillsInput.value =
                Array.isArray(data.skills)
                    ? data.skills.join("\n")
                    : "";

        }


        if (contactEmailInput) {

            contactEmailInput.value =
                data.email || "";

        }


        if (githubInput) {

            githubInput.value =
                data.github || "";

        }


        if (linkedinInput) {

            linkedinInput.value =
                data.linkedin || "";

        }


        if (resumeInput) {

            resumeInput.value =
                data.resume ||
                "assets/Hamza_Ansari_Resume.pdf";

        }


        /* PROJECTS */

        if (Array.isArray(data.projects)) {

            projects =
                data.projects.map(project => {

                    const convertedTags = [];


                    if (Array.isArray(project.tags)) {

                        project.tags.forEach(tag => {

                            if (
                                typeof tag === "object" &&
                                tag !== null
                            ) {

                                convertedTags.push({

                                    name:
                                        tag.name || "",

                                    url:
                                        tag.url || ""

                                });

                            } else if (
                                typeof tag === "string"
                            ) {

                                convertedTags.push({

                                    name: tag,

                                    url: ""

                                });

                            }

                        });

                    }


                    return {

                        title:
                            project.title || "",

                        description:
                            project.description || "",

                        projectUrl:
                            project.projectUrl || "",

                        tags:
                            convertedTags

                    };

                });

        } else {

            projects = [];

        }


        renderProjects();

    } catch (error) {

        console.error(
            "Error loading portfolio:",
            error
        );

    }

}


/* =========================================================
   RENDER PROJECTS
========================================================= */

function renderProjects() {

    if (!projectsList) return;


    projectsList.innerHTML = "";


    if (projects.length === 0) {

        projectsList.innerHTML = `
            <p class="empty-projects">
                No projects added yet.
            </p>
        `;

        return;

    }


    projects.forEach(
        (project, index) => {

            const projectItem =
                document.createElement("div");

            projectItem.className =
                "project-item";


            const tagsText =
                Array.isArray(project.tags)
                    ? project.tags
                        .map(tag =>
                            typeof tag === "object"
                                ? tag.name || ""
                                : tag
                        )
                        .filter(Boolean)
                        .join(", ")
                    : "";


            projectItem.innerHTML = `

                <div class="project-item-content">

                    <h4>
                        ${escapeHtml(project.title)}
                    </h4>

                    <p>
                        ${escapeHtml(project.description)}
                    </p>

                    ${
                        project.projectUrl
                            ? `
                                <p class="project-url-preview">
                                    🔗 Project link added
                                </p>
                            `
                            : `
                                <p class="project-url-preview">
                                    🔗 No project link
                                </p>
                            `
                    }

                    ${
                        tagsText
                            ? `
                                <p class="project-tags-preview">
                                    🏷️ ${escapeHtml(tagsText)}
                                </p>
                            `
                            : ""
                    }

                </div>


                <div class="project-actions">

                    <button
                        type="button"
                        class="edit-project-button"
                        data-index="${index}">
                        Edit
                    </button>


                    <button
                        type="button"
                        class="delete-project-button"
                        data-index="${index}">
                        Delete
                    </button>

                </div>
            `;


            projectsList.appendChild(
                projectItem
            );

        }
    );


    /* EDIT BUTTONS */

    document
        .querySelectorAll(
            ".edit-project-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    editProject(index);

                }
            );

        });


    /* DELETE BUTTONS */

    document
        .querySelectorAll(
            ".delete-project-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    deleteProject(index);

                }
            );

        });

}


/* =========================================================
   EDIT PROJECT
========================================================= */

function editProject(index) {

    const project =
        projects[index];


    if (!project) return;


    editingProjectIndex =
        index;


    if (projectFormHeading) {

        projectFormHeading.textContent =
            "Edit Project";

    }


    if (projectTitleInput) {

        projectTitleInput.value =
            project.title || "";

    }


    if (projectDescriptionInput) {

        projectDescriptionInput.value =
            project.description || "";

    }


    if (projectUrlInput) {

        projectUrlInput.value =
            project.projectUrl || "";

    }


    clearTagRows();


    if (
        Array.isArray(project.tags) &&
        project.tags.length > 0
    ) {

        project.tags.forEach(tag => {

            if (
                typeof tag === "object" &&
                tag !== null
            ) {

                addTagRow(
                    tag.name || "",
                    tag.url || ""
                );

            } else {

                addTagRow(
                    String(tag),
                    ""
                );

            }

        });

    }


    if (saveProjectButton) {

        saveProjectButton.textContent =
            "Update Project";

    }


    if (cancelProjectButton) {

        cancelProjectButton.style.display =
            "inline-block";

    }


    openProjectEditor();

    updateProjectPreview();

}


/* =========================================================
   DELETE PROJECT
========================================================= */

function deleteProject(index) {

    if (!projects[index]) return;


    const confirmed =
        confirm(
            `Delete "${projects[index].title}"?`
        );


    if (!confirmed) return;


    projects.splice(
        index,
        1
    );


    renderProjects();


    /*
       If the deleted project was currently
       being edited, reset the editor.
    */

    if (editingProjectIndex === index) {

        resetProjectForm();

        closeProjectEditor();

    }

}


/* =========================================================
   SAVE / UPDATE PROJECT
========================================================= */

if (saveProjectButton) {

    saveProjectButton.addEventListener(
        "click",
        () => {

            const wasEditing =
                editingProjectIndex !== -1;


            /* GET VALUES */

            const title =
                projectTitleInput
                    ? projectTitleInput.value.trim()
                    : "";


            const description =
                projectDescriptionInput
                    ? projectDescriptionInput.value.trim()
                    : "";


            const projectUrl =
                projectUrlInput
                    ? projectUrlInput.value.trim()
                    : "";


            const tags =
                getTagData();


            /* VALIDATION */

            if (!title) {

                alert(
                    "Please enter project title."
                );

                return;

            }


            /* PROJECT OBJECT */

            const projectData = {

                title:
                    title,

                description:
                    description,

                projectUrl:
                    projectUrl,

                tags:
                    tags

            };


            /* UPDATE */

            if (
                wasEditing &&
                projects[editingProjectIndex]
            ) {

                projects[
                    editingProjectIndex
                ] = projectData;


                renderProjects();

                resetProjectForm();

                closeProjectEditor();


                alert(
                    "Project updated successfully!"
                );

                return;

            }


            /* ADD */

            projects.push(
                projectData
            );


            renderProjects();

            resetProjectForm();

            closeProjectEditor();


            alert(
                "Project added successfully!"
            );

        }
    );

}


/* =========================================================
   LIVE PROJECT PREVIEW
========================================================= */

const previewTitle =
    document.getElementById(
        "preview-project-title"
    );

const previewDescription =
    document.getElementById(
        "preview-project-description"
    );

const previewTags =
    document.getElementById(
        "preview-project-tags"
    );


/* =========================================================
   UPDATE PROJECT PREVIEW
========================================================= */

function updateProjectPreview() {

    if (
        previewTitle &&
        projectTitleInput
    ) {

        const title =
            projectTitleInput.value.trim();


        previewTitle.textContent =
            title ||
            "Project Title";

    }


    if (
        previewDescription &&
        projectDescriptionInput
    ) {

        const description =
            projectDescriptionInput.value.trim();


        previewDescription.textContent =
            description ||
            "Project description will appear here.";

    }


    if (previewTags) {

        previewTags.innerHTML = "";


        const tagRows =
            document.querySelectorAll(
                ".tag-link-row"
            );


        tagRows.forEach(row => {

            const nameInput =
                row.querySelector(
                    ".tag-name-input"
                );


            if (
                nameInput &&
                nameInput.value.trim()
            ) {

                const tag =
                    document.createElement(
                        "span"
                    );


                tag.className =
                    "preview-tag";


                tag.textContent =
                    nameInput.value.trim();


                previewTags.appendChild(
                    tag
                );

            }

        });

    }

}


/* =========================================================
   PREVIEW WHILE TYPING
========================================================= */

if (projectTitleInput) {

    projectTitleInput.addEventListener(
        "input",
        updateProjectPreview
    );

}


if (projectDescriptionInput) {

    projectDescriptionInput.addEventListener(
        "input",
        updateProjectPreview
    );

}


document.addEventListener(
    "input",
    event => {

        if (
            event.target.closest(
                ".tag-link-row"
            )
        ) {

            updateProjectPreview();

        }

    }
);


/* =========================================================
   INITIAL PREVIEW
========================================================= */

updateProjectPreview();


/* =========================================================
   SAVE PORTFOLIO TO FIRESTORE
========================================================= */

if (saveButton) {

    saveButton.addEventListener(
        "click",
        async (event) => {

            /*
                Because this button is inside
                the portfolio form, prevent the
                browser's default form submission.
            */

            event.preventDefault();


            try {

                saveButton.disabled =
                    true;


                saveButton.textContent =
                    "Saving...";


                /* TYPING ROLES */

                const typingRoles =
                    typingRolesInput
                        ? typingRolesInput.value
                            .split("\n")
                            .map(role =>
                                role.trim()
                            )
                            .filter(Boolean)
                        : [];


                /* SKILLS */

                const skills =
                    skillsInput
                        ? skillsInput.value
                            .split("\n")
                            .map(skill =>
                                skill.trim()
                            )
                            .filter(Boolean)
                        : [];


                /* PORTFOLIO DATA */

                const portfolioData = {

                    fullName:
                        fullNameInput
                            ? fullNameInput.value.trim()
                            : "",

                    typingRoles:
                        typingRoles,

                    heroDescription:
                        heroDescriptionInput
                            ? heroDescriptionInput.value.trim()
                            : "",

                    about:
                        aboutInput
                            ? aboutInput.value.trim()
                            : "",

                    skills:
                        skills,

                    projects:
                        projects,

                    email:
                        contactEmailInput
                            ? contactEmailInput.value.trim()
                            : "",

                    github:
                        githubInput
                            ? githubInput.value.trim()
                            : "",

                    linkedin:
                        linkedinInput
                            ? linkedinInput.value.trim()
                            : "",

                    resume:
                        resumeInput
                            ? resumeInput.value.trim()
                            : "assets/Hamza_Ansari_Resume.pdf"

                };


                /* FIRESTORE */

                await setDoc(
                    portfolioRef,
                    portfolioData
                );


                alert(
                    "Portfolio saved successfully!"
                );


            } catch (error) {

                console.error(
                    "Error saving portfolio:",
                    error
                );


                alert(
                    "Error saving portfolio. Check console."
                );


            } finally {

                saveButton.disabled =
                    false;


                saveButton.textContent =
                    "Save Portfolio";

            }

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}