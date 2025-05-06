document.addEventListener("DOMContentLoaded", () => {
  const timersContainer = document.getElementById("timersContainer");
  const addTimerButton = document.getElementById("addTimer");
  const timerTemplate = document.getElementById("timerTemplate");
  const alertSound = document.getElementById("alertSound");

  class Timer {
    constructor(container) {
      this.container = container;
      this.titleInput = container.querySelector(".timer-title");
      this.titleInputGroup = container.querySelector(".timer-title-input");
      this.titleDisplay = container.querySelector(".timer-title-display");
      this.durationInput = container.querySelector(".timer-duration");
      this.chanceInput = container.querySelector(".percentage-chance");
      this.maxNumberInput = container.querySelector(".max-number");
      this.startButton = container.querySelector(".start-timer");
      this.cancelButton = container.querySelector(".cancel-timer");
      this.removeButton = container.querySelector(".remove-timer");
      this.display = container.querySelector(".timer-display");
      this.allInputGroups = container.querySelectorAll(".input-group");

      this.timerInterval = null;
      this.soundTimeout = null;
      this.endTimeout = null;

      // Set default title without count
      if (!this.titleInput.value) {
        this.titleInput.value = "Timer";
      }

      this.setupEventListeners();
    }

    setupEventListeners() {
      this.startButton.addEventListener("click", () => this.startTimer());
      this.cancelButton.addEventListener("click", () => this.cancelTimer());
      this.removeButton.addEventListener("click", () => this.removeTimer());
      this.container
        .querySelector(".randomize-chance")
        .addEventListener("click", () => this.randomizeChance());
      this.titleInput.addEventListener("change", () => {
        if (!this.titleInput.value.trim()) {
          this.titleInput.value = "Timer";
        }
      });
    }

    randomizeChance() {
      const randomChance = Math.floor(Math.random() * 101); // 0-100
      this.chanceInput.value = randomChance;
    }

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }

    hideFormFields() {
      this.allInputGroups.forEach((group) => {
        group.style.display = "none";
      });
      this.titleDisplay.style.display = "block";
    }

    showFormFields() {
      this.allInputGroups.forEach((group) => {
        group.style.display = "block";
      });
      this.titleDisplay.style.display = "none";
    }

    resetTimer(keepCancelEnabled = false) {
      clearInterval(this.timerInterval);
      clearTimeout(this.soundTimeout);
      clearTimeout(this.endTimeout);
      this.startButton.disabled = false;
      if (!keepCancelEnabled) {
        this.cancelButton.disabled = true;
        this.showFormFields();
      }
      this.display.textContent = "00:00";
    }

    handleAlert() {
      clearInterval(this.timerInterval);
      clearTimeout(this.soundTimeout);
      clearTimeout(this.endTimeout);
      this.startButton.disabled = false;

      // Generate random number
      const maxNumber = parseInt(this.maxNumberInput.value);
      const randomNumber = Math.floor(Math.random() * maxNumber) + 1;

      alertSound.play();
      this.container.classList.add("alert-active", "timer-triggered");
      this.display.classList.add("alert-active");

      // Show both the time and random number
      const currentTime = this.display.textContent;
      this.display.textContent = `${currentTime} (${randomNumber})`;

      setTimeout(() => {
        this.container.classList.remove("alert-active");
        this.display.classList.remove("alert-active");
      }, 1000);
    }

    cancelTimer() {
      alertSound.pause();
      alertSound.currentTime = 0;
      this.container.classList.remove("alert-active", "timer-triggered");
      this.display.classList.remove("alert-active");
      this.resetTimer();
    }

    removeTimer() {
      alertSound.pause();
      alertSound.currentTime = 0;
      // Clear all timeouts and intervals
      clearInterval(this.timerInterval);
      clearTimeout(this.soundTimeout);
      clearTimeout(this.endTimeout);
      // Remove the timer element
      this.container.remove();
    }

    startTimer() {
      const duration = parseInt(this.durationInput.value);
      const chance = parseInt(this.chanceInput.value);
      const maxNumber = parseInt(this.maxNumberInput.value);

      if (duration < 1 || chance < 0 || chance > 100 || maxNumber < 1) {
        alert(
          "Please enter valid values (duration > 0, chance 0-100, max number > 0)"
        );
        return;
      }

      // Update title and hide form fields
      this.titleDisplay.textContent = this.titleInput.value || "Timer";
      this.hideFormFields();

      this.startButton.disabled = true;
      this.cancelButton.disabled = false;

      if (Math.random() < chance / 100) {
        const randomTime = Math.floor(Math.random() * (duration * 1000));
        this.soundTimeout = setTimeout(() => this.handleAlert(), randomTime);
      }

      let timeLeft = duration;
      this.display.textContent = this.formatTime(timeLeft);

      this.timerInterval = setInterval(() => {
        timeLeft--;
        this.display.textContent = this.formatTime(timeLeft);

        if (timeLeft <= 0) {
          this.resetTimer();
        }
      }, 1000);
    }
  }

  function createNewTimer() {
    const timerElement = timerTemplate.content.cloneNode(true);
    timersContainer.appendChild(timerElement);
    const newTimerContainer = timersContainer.lastElementChild;
    new Timer(newTimerContainer);
  }

  addTimerButton.addEventListener("click", createNewTimer);

  // Create initial timer
  createNewTimer();
});
