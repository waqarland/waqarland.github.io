/**
 * Mobile Accordion for Experience Cards & Skills
 * Only activates on screens ≤991px.
 * Desktop is completely unaffected.
 */
(function () {
    'use strict';

    var MOBILE_BP = 991;

    function isMobile() {
        return window.innerWidth <= MOBILE_BP;
    }

    // --- Experience Cards Accordion ---

    function initExperienceAccordion() {
        // Target experience cards inside #section-resume
        // "My Experiences" row → .row.g-4 > .col-lg-6 > .glass-card
        var resumeSection = document.getElementById('section-resume');
        if (!resumeSection) return;

        // Find the "My Experiences" container (first .row.g-4 inside resume)
        var expRows = resumeSection.querySelectorAll('.row.g-4');
        if (!expRows.length) return;

        var expRow = expRows[0]; // First row is experiences, second is education
        var cards = expRow.querySelectorAll('.col-lg-6 > .glass-card');

        cards.forEach(function (card, index) {
            if (card.classList.contains('mob-accordion')) return; // Already initialized

            card.classList.add('mob-accordion');

            // Get existing children
            var title = card.querySelector('.d_timeline-title');
            var allChildren = Array.from(card.children);

            // Create header wrapper
            var header = document.createElement('div');
            header.className = 'mob-acc-header';

            var meta = document.createElement('div');
            meta.className = 'mob-acc-meta';

            // Find the first paragraph (contains role title + company)
            var firstPara = card.querySelector('p.d_timeline-text');

            // Move the title and first descriptive paragraph into meta
            if (title) meta.appendChild(title.cloneNode(true));

            // Extract just the role title and company from the first paragraph
            if (firstPara) {
                var roleSpan = firstPara.querySelector('.d_title');
                var companySpan = firstPara.querySelector('.d_company');
                if (roleSpan) {
                    var roleEl = document.createElement('p');
                    roleEl.className = 'd_timeline-text';
                    roleEl.style.marginBottom = '0';
                    roleEl.appendChild(roleSpan.cloneNode(true));
                    if (companySpan) {
                        roleEl.appendChild(companySpan.cloneNode(true));
                    }
                    meta.appendChild(roleEl);
                }
            }

            // Create toggle icon
            var toggle = document.createElement('span');
            toggle.className = 'mob-acc-toggle';
            toggle.setAttribute('aria-label', 'Toggle details');

            header.appendChild(meta);
            header.appendChild(toggle);

            // Create body wrapper for everything else
            var body = document.createElement('div');
            body.className = 'mob-acc-body';

            // Move all original children to body
            allChildren.forEach(function (child) {
                body.appendChild(child);
            });

            // Insert header and body into the card
            card.innerHTML = '';
            card.appendChild(header);
            card.appendChild(body);

            // Click handler
            card.addEventListener('click', function (e) {
                // Don't toggle if clicking a link inside the card
                if (e.target.tagName === 'A') return;

                if (!isMobile()) return;

                var isOpen = card.classList.contains('mob-acc-open');

                // Close all other cards in this group (accordion behavior)
                cards.forEach(function (otherCard) {
                    if (otherCard !== card && otherCard.classList.contains('mob-acc-open')) {
                        collapseCard(otherCard);
                    }
                });

                if (isOpen) {
                    collapseCard(card);
                } else {
                    expandCard(card);
                }
            });
        });
    }

    function expandCard(card) {
        card.classList.add('mob-acc-open');
        var body = card.querySelector('.mob-acc-body');
        if (body) {
            body.style.maxHeight = body.scrollHeight + 'px';
        }
    }

    function collapseCard(card) {
        card.classList.remove('mob-acc-open');
        var body = card.querySelector('.mob-acc-body');
        if (body) {
            body.style.maxHeight = '0';
        }
    }

    // --- Skills Section Accordion ---

    function initSkillsAccordion() {
        var skillsSection = document.getElementById('section-skills');
        if (!skillsSection) return;

        // Target the <li> elements that contain "Technical Skills" and "Soft Skills"
        var skillItems = skillsSection.querySelectorAll('ul.d_timeline > li');

        skillItems.forEach(function (item, index) {
            if (item.classList.contains('mob-skills-accordion')) return; // Already initialized

            item.classList.add('mob-skills-accordion');

            var h3 = item.querySelector('h3');
            var contentRow = item.querySelector('.row');

            if (!h3 || !contentRow) return;

            // Create header
            var header = document.createElement('div');
            header.className = 'mob-skills-header';

            // Clone h3 into header
            header.appendChild(h3);

            // Create toggle
            var toggle = document.createElement('span');
            toggle.className = 'mob-skills-toggle';
            toggle.setAttribute('aria-label', 'Toggle skills');
            header.appendChild(toggle);

            // Wrap the row content in body
            var body = document.createElement('div');
            body.className = 'mob-skills-body';
            body.appendChild(contentRow);

            // Clear and rebuild item
            item.innerHTML = '';
            item.appendChild(header);
            item.appendChild(body);

            // Click handler on header
            header.addEventListener('click', function (e) {
                if (!isMobile()) return;

                var isOpen = item.classList.contains('mob-skills-open');

                // Close all other skill sections (accordion)
                skillItems.forEach(function (otherItem) {
                    if (otherItem !== item && otherItem.classList.contains('mob-skills-open')) {
                        collapseSkill(otherItem);
                    }
                });

                if (isOpen) {
                    collapseSkill(item);
                } else {
                    expandSkill(item);
                }
            });
        });
    }

    function expandSkill(item) {
        item.classList.add('mob-skills-open');
        var body = item.querySelector('.mob-skills-body');
        if (body) {
            body.style.maxHeight = body.scrollHeight + 'px';
        }
    }

    function collapseSkill(item) {
        item.classList.remove('mob-skills-open');
        var body = item.querySelector('.mob-skills-body');
        if (body) {
            body.style.maxHeight = '0';
        }
    }

    // --- Restore on Desktop Resize ---

    function handleResize() {
        if (!isMobile()) {
            // On desktop, force all accordion bodies open
            var accBodies = document.querySelectorAll('.mob-acc-body');
            accBodies.forEach(function (body) {
                body.style.maxHeight = 'none';
            });

            var skillBodies = document.querySelectorAll('.mob-skills-body');
            skillBodies.forEach(function (body) {
                body.style.maxHeight = 'none';
            });
        } else {
            // On mobile, re-collapse any that aren't explicitly open
            var accBodies = document.querySelectorAll('.mob-acc-body');
            accBodies.forEach(function (body) {
                var card = body.closest('.mob-accordion');
                if (card && !card.classList.contains('mob-acc-open')) {
                    body.style.maxHeight = '0';
                }
            });

            var skillBodies = document.querySelectorAll('.mob-skills-body');
            skillBodies.forEach(function (body) {
                var item = body.closest('.mob-skills-accordion');
                if (item && !item.classList.contains('mob-skills-open')) {
                    body.style.maxHeight = '0';
                }
            });
        }
    }

    // --- Init ---

    function init() {
        initExperienceAccordion();
        initSkillsAccordion();
        handleResize();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOMContentLoaded may have already fired (deferred scripts)
        init();
    }

    // Handle window resize
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 150);
    });

})();
