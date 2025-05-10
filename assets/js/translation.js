let translations = {};

function loadTranslations(lang) {
    fetch(`assets/locale/${lang}/locale.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error("locale.json fetch error: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            translations = data;
            applyTranslations();
        })
        .catch(error => {
            console.error(error);
        });
}

function applyTranslations() {
    document.querySelectorAll('[data-key]')
        .forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
    // Re-initialize FAQ accordion after translations
    initFaqAccordion();
}

function initFaqAccordion() {
    document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
        faqItem.onclick = null;
        faqItem.addEventListener('click', () => {
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('faq-active');
                const content = item.querySelector('.faq-content');
                if (content) content.style.maxHeight = null;
            });
            const parent = faqItem.parentNode;
            parent.classList.add('faq-active');
            const content = parent.querySelector('.faq-content');
            if (content) content.style.maxHeight = content.scrollHeight + 'px';
        });
    });
    // Set maxHeight for active FAQ on load
    document.querySelectorAll('.faq-item').forEach(item => {
        const content = item.querySelector('.faq-content');
        if (item.classList.contains('faq-active') && content) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
}

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    loadTranslations(lang);
}

function changeLanguage(select) {
    const lang = select.value;
    setLanguage(lang);
    const flagCode = select.options[select.selectedIndex].getAttribute("data-flag");
    document.getElementById("current-flag").src = `https://flagcdn.com/w40/${flagCode}.png`;
}

document.addEventListener("DOMContentLoaded", function () {
    const savedLang = localStorage.getItem('language') || 'fr';
    const languageSelect = document.getElementById("language-select");
    languageSelect.value = savedLang;
    const selectedOption = languageSelect.options[languageSelect.selectedIndex];
    const flagCode = selectedOption.getAttribute("data-flag");
    document.getElementById("current-flag").src = `https://flagcdn.com/w40/${flagCode}.png`;
    setLanguage(savedLang);
});