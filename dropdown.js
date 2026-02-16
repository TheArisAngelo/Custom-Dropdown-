(() => {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dd) => {
    const toggle = dd.querySelector(".dropdown__toggle");
    const label = dd.querySelector(".dropdown__label");
    const menu = dd.querySelector(".dropdown__menu");
    const options = Array.from(dd.querySelectorAll(".dropdown__option"));
    const hidden = dd.querySelector(".dropdown__value");

    const placeholder = dd.dataset.placeholder ?? label.textContent.trim();
    let selectedIndex = -1;

    setPlaceholderIfEmpty();

    function isOpen() {
      return dd.classList.contains("is-open");
    }

    function open() {
      dd.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");

      const toFocus = options[selectedIndex] ?? options[0];
      requestAnimationFrame(() => toFocus?.focus());
    }

    function close({ focusToggle = true } = {}) {
      dd.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (focusToggle) toggle.focus();
    }

    function setPlaceholderIfEmpty() {
      const hasValue = hidden && hidden.value;
      if (!hasValue && selectedIndex === -1) {
        dd.classList.add("is-placeholder");
        label.textContent = placeholder;
      }
    }

    function selectOption(opt) {
      options.forEach((o) => {
        const selected = o === opt;
        o.classList.toggle("is-selected", selected);
        o.setAttribute("aria-selected", selected ? "true" : "false");
      });

      selectedIndex = options.indexOf(opt);
      const value = opt.dataset.value ?? opt.textContent.trim();

      if (hidden) hidden.value = value;

      dd.classList.remove("is-placeholder");
      label.textContent = opt.textContent.trim();

      close({ focusToggle: true });
    }

    // Toggle open/close
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      isOpen() ? close({ focusToggle: false }) : open();
    });

    // Option click
    options.forEach((opt) => {
      opt.addEventListener("click", () => selectOption(opt));
    });

    // Close on outside click/tap
    document.addEventListener("pointerdown", (e) => {
      if (!dd.contains(e.target) && isOpen()) close({ focusToggle: false });
    });

    // Keyboard support: open from button
    toggle.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });

    // Keyboard inside menu
    menu.addEventListener("keydown", (e) => {
      const current = document.activeElement;
      const i = options.indexOf(current);

      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        (options[i + 1] ?? options[0])?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        (options[i - 1] ?? options[options.length - 1])?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        options[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        options[options.length - 1]?.focus();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (current?.classList.contains("dropdown__option"))
          selectOption(current);
      } else if (e.key === "Tab") {
        close({ focusToggle: false });
      }
    });
  });
})();
