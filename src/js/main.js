/** Check type of device */
const isMobileDevice = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isTouchScreen = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
        return true;
    }

    if (isTouchScreen && (window.innerWidth <= 1366)) {
        return true;
    }

    return false;
};

if (isMobileDevice()) {
    document.querySelector("body").classList.add("mobile");
}


/**Video on mobile */
document.querySelectorAll(".roster__block-item--play").forEach(item => {
    item.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
    });
});


/** Burger menu */
const burgerMenu = () => {
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.menu');
    const body = document.querySelector('body');

    burger.addEventListener('click', () => {
        if (!menu.classList.contains('active')) {
            menu.classList.add('active');
            burger.classList.add('active');
            body.classList.add('locked');
        } else {
            menu.classList.remove('active');
            burger.classList.remove('active');
            body.classList.remove('locked');
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 991.98) {
            menu.classList.remove('active');
            burger.classList.remove('active');
            body.classList.remove('locked');
        }
    });
}

burgerMenu();


/** Fixed menu on scroll */
const header = document.querySelector('.header');

window.addEventListener('scroll', function () {
    if (window.scrollY > header.offsetHeight) {
        document.querySelector("body").style.marginTop = `${header.offsetHeight}px`;
        header.classList.add("hidden");
        if (window.scrollY > header.offsetHeight * 2) {
            header.classList.add("fixed");
        }
    } else {
        document.querySelector("body").style.marginTop = `0`;
        header.classList.remove("hidden");
        header.classList.remove("fixed");
    }
});


/** Play video on hover */
document.querySelectorAll('.roster__block-item').forEach(item => {
    const video = item.querySelector('video');

    item.addEventListener('mouseenter', () => {
        video.play();
    });

    item.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });
});

/** Modal window */
/** Gallery into modal */
try {
    const galleryInModal = (classButton, idModal, classImage) => {
        const galleryItems = Array.from(document.querySelectorAll(classButton));
        const modal = document.getElementById(idModal);
        const modalImage = document.getElementById("modalImage");
        const nextImage = document.getElementById("next-image");
        const prevImage = document.getElementById("prev-image");
        const body = document.querySelector("body");
        let totalImages = galleryItems.length;
        let currentIndex = 0;

        galleryItems.forEach((item) => {
            item.addEventListener("click", function (event) {
                event.preventDefault();
                currentIndex = parseInt(item.dataset.index, 10);
                openModal();
            });
        });

        const openModal = () => {
            body.classList.add('locked');
            modal.style.display = "flex";
            updateModalImage();
        };

        const closeModal = () => {
            modal.style.display = "none";
            body.classList.remove('locked');
        };

        const updateModalImage = () => {
            modalImage.src = galleryItems[currentIndex].querySelector(classImage).src;
        };

        const showPreviousImage = () => {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            updateModalImage();
        };

        const showNextImage = () => {
            currentIndex = (currentIndex + 1) % totalImages;
            updateModalImage();
        };

        document.querySelector(".close").addEventListener("click", closeModal);
        window.addEventListener("click", (event) => {
            if (event.target === modal) closeModal();
        });

        window.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") showPreviousImage();
            if (event.key === "ArrowRight") showNextImage();
            if (event.key === "Escape") closeModal();
        });

        prevImage.addEventListener("click", (event) => {
            event.preventDefault();
            showPreviousImage();
        });

        nextImage.addEventListener("click", (event) => {
            event.preventDefault();
            showNextImage();
        });
    };

    galleryInModal(".gallery__block-item--img", "galleryModal", "img");
} catch (error) {
    console.error("Error in gallery:", error);
}

/** Listen audio tracks */
try {
    const path = "/mp3/";
    const audio = new Audio();
    let currentPlayer = null;
    let isPlaying = false;

    document.querySelectorAll(".audio__block-player").forEach(player => {
        const playBtn = player.querySelector(".audio__block-btn");
        const timeDisplay = player.querySelector(".audio__block-time");
        const progressBar = player.querySelector(".audio__block-progress--bar");
        const audioSrc = path + player.getAttribute("data-src");

        let duration = 0;

        const tempAudio = new Audio(audioSrc);
        tempAudio.addEventListener("loadedmetadata", () => {
            duration = tempAudio.duration;
            timeDisplay.innerHTML = `<span>0:00</span><span>${formatTime(duration)}</span>`;
        });

        playBtn.addEventListener("click", () => {
            if (currentPlayer !== player) {
                stopCurrentAudio();
                audio.src = audioSrc;
                audio.load();
                currentPlayer = player;
            }

            if (audio.paused) {
                audio.play();
                isPlaying = true;
                playBtn.textContent = "⏸";
            } else {
                audio.pause();
                isPlaying = false;
                playBtn.textContent = "▶";
            }
        });

        audio.addEventListener("timeupdate", () => {
            if (currentPlayer === player) {
                timeDisplay.innerHTML = `<span>${formatTime(audio.currentTime)}</span><span>${formatTime(duration)}</span>`;
                progressBar.style.width = `${(audio.currentTime / duration) * 100}%`;
            }
        });

        audio.addEventListener("ended", () => {
            if (currentPlayer === player) {
                isPlaying = false;
                playBtn.textContent = "▶";
                progressBar.style.width = "0%";
                timeDisplay.innerHTML = `<span>0:00</span><span>${formatTime(duration)}</span>`;
            }
        });
    });

    const stopCurrentAudio = () => {
        if (currentPlayer) {
            currentPlayer.querySelector(".audio__block-btn").textContent = "▶";
            currentPlayer.querySelector(".audio__block-progress--bar").style.width = "0%";
            audio.pause();
            audio.currentTime = 0;
            isPlaying = false;
            const timeDisplay = currentPlayer.querySelector(".audio__block-time");
            if (timeDisplay) {
                timeDisplay.innerHTML = `<span>0:00</span><span>${formatTime(audio.duration || 0)}</span>`;
            }
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

} catch (error) {
    console.error("Audio player error:", error);
}

