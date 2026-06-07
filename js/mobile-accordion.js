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
        var resumeSection = document.getElementById('section-resume');
        if (!resumeSection) return;

        var expRows = resumeSection.querySelectorAll('.row.g-4');
        if (!expRows.length) return;

        var expRow = expRows[0];
        var cards = expRow.querySelectorAll('.col-lg-6 > .glass-card');

        cards.forEach(function (card, index) {
            if (card.classList.contains('mob-accordion')) return;

            card.classList.add('mob-accordion');

            var title = card.querySelector('.d_timeline-title');
            var allChildren = Array.from(card.children);

            var header = document.createElement('div');
            header.className = 'mob-acc-header mob-only-header'; // new class for visibility

            var meta = document.createElement('div');
            meta.className = 'mob-acc-meta';

            var firstPara = card.querySelector('p.d_timeline-text');

            if (title) {
                meta.appendChild(title.cloneNode(true));
                title.classList.add('hide-on-mobile'); // hide original on mobile
            }

            if (firstPara) {
                var roleSpan = firstPara.querySelector('.d_title');
                var companySpan = firstPara.querySelector('.d_company');
                if (roleSpan) {
                    var roleEl = document.createElement('p');
                    roleEl.className = 'd_timeline-text';
                    roleEl.style.marginBottom = '0';
                    roleEl.appendChild(roleSpan.cloneNode(true));
                    roleSpan.classList.add('hide-on-mobile'); // hide original on mobile

                    if (companySpan) {
                        roleEl.appendChild(companySpan.cloneNode(true));
                        companySpan.classList.add('hide-on-mobile'); // hide original on mobile
                    }
                    meta.appendChild(roleEl);
                }
            }

            var toggle = document.createElement('span');
            toggle.className = 'mob-acc-toggle';
            toggle.setAttribute('aria-label', 'Toggle details');

            header.appendChild(meta);
            header.appendChild(toggle);

            var body = document.createElement('div');
            body.className = 'mob-acc-body';

            allChildren.forEach(function (child) {
                body.appendChild(child);
            });

            card.innerHTML = '';
            card.appendChild(header);
            card.appendChild(body);

            card.addEventListener('click', function (e) {
                if (e.target.tagName === 'A') return;
                if (!isMobile()) return;

                var isOpen = card.classList.contains('mob-acc-open');

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

        var skillItems = skillsSection.querySelectorAll('ul.d_timeline > li');

        skillItems.forEach(function (item, index) {
            if (item.classList.contains('mob-skills-accordion')) return;

            item.classList.add('mob-skills-accordion');

            var h3 = item.querySelector('h3');
            var contentRow = item.querySelector('.row');

            if (!h3 || !contentRow) return;

            var header = document.createElement('div');
            header.className = 'mob-skills-header mob-only-header'; // new class

            header.appendChild(h3.cloneNode(true));
            h3.classList.add('hide-on-mobile');

            var toggle = document.createElement('span');
            toggle.className = 'mob-skills-toggle';
            toggle.setAttribute('aria-label', 'Toggle skills');
            header.appendChild(toggle);

            var body = document.createElement('div');
            body.className = 'mob-skills-body';
            
            // Append the original h3 and row to the body so they exist but h3 is hidden on mobile
            body.appendChild(h3);
            body.appendChild(contentRow);

            item.innerHTML = '';
            item.appendChild(header);
            item.appendChild(body);

            header.addEventListener('click', function (e) {
                if (!isMobile()) return;

                var isOpen = item.classList.contains('mob-skills-open');

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
            var accBodies = document.querySelectorAll('.mob-acc-body, .mob-skills-body');
            accBodies.forEach(function (body) {
                body.style.maxHeight = 'none';
            });
        } else {
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

    function init() {
        initExperienceAccordion();
        initSkillsAccordion();
        handleResize();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 150);
    });

})();
