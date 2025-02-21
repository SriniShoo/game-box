// assets/js/header.js
document.addEventListener('DOMContentLoaded', function() {
  // Hamburger toggle and auto-hide on outside click
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const dropdownMenu = document.getElementById("dropdownMenu");
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  if (hamburgerBtn && dropdownMenu && hamburgerMenu) {
    hamburgerBtn.addEventListener("click", function(event) {
      event.stopPropagation();
      dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });
    document.addEventListener("click", function(event) {
      if (!hamburgerMenu.contains(event.target)) {
        dropdownMenu.style.display = "none";
      }
    });
  }

  // Voice selection & mute/unmute setup
  const muteBtn = document.getElementById('muteBtn');
  const voiceSelect = document.getElementById('voiceSelect');

  if (muteBtn && voiceSelect) {
    // Set initial mute button text based on localStorage
    if (localStorage.getItem("isMuted") === "true") {
      muteBtn.textContent = "Unmute";
    } else {
      muteBtn.textContent = "Mute";
    }
    muteBtn.addEventListener('click', function() {
      const isMuted = localStorage.getItem("isMuted") === "true";
      if (isMuted) {
        localStorage.setItem("isMuted", "false");
        muteBtn.textContent = "Mute";
      } else {
        localStorage.setItem("isMuted", "true");
        muteBtn.textContent = "Unmute";
      }
    });

    function populateVoices() {
      const voices = speechSynthesis.getVoices();
      voiceSelect.innerHTML = "";
      const addGroup = (label, voicesList) => {
        if (voicesList.length > 0) {
          const group = document.createElement('optgroup');
          group.label = label;
          voicesList.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name + "|" + voice.lang;
            option.textContent = `${voice.name} (${voice.lang})`;
            group.appendChild(option);
          });
          voiceSelect.appendChild(group);
        }
      };
      addGroup("Indian English", voices.filter(v => v.lang.startsWith("en-IN")));
      addGroup("British English", voices.filter(v => v.lang.startsWith("en-GB")));
      addGroup("American English", voices.filter(v => v.lang.startsWith("en-US")));
      addGroup("Other English", voices.filter(v =>
        v.lang.startsWith("en") &&
        !v.lang.startsWith("en-IN") &&
        !v.lang.startsWith("en-GB") &&
        !v.lang.startsWith("en-US")
      ));
      
      // Restore saved voice if exists
      const savedVoice = localStorage.getItem("defaultVoice");
      if (savedVoice) {
        for (let i = 0; i < voiceSelect.options.length; i++) {
          if (voiceSelect.options[i].value === savedVoice) {
            voiceSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
    voiceSelect.addEventListener('change', function() {
      localStorage.setItem("defaultVoice", voiceSelect.value);
    });
    if ('speechSynthesis' in window) {
      populateVoices();
      speechSynthesis.onvoiceschanged = populateVoices;
    }
    if (localStorage.getItem("isMuted") === null) {
      localStorage.setItem("isMuted", "false");
    }
  }
});