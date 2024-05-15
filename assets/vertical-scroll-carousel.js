document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll(".section-vertical-carousel");
    const productSteps = document.querySelectorAll(".product-step-container");
    let touchStartY = 0;
    let directionDown = true;
  
    carousels.forEach((carousel) => {
      carousel.setAttribute("data-slide", 1);
      isElementInViewport(
        carousel.querySelector(".js-vertical-scroll-carousel"),
        0.1,
        function () {
          updateHeaderStep(carousel);
        }
      );
    });
  
    productSteps.forEach((productStep) => {
      if (window.isElementInViewport) {
        isElementInViewport(productStep, undefined, function() {
          updateHeaderStep(productStep.closest((".section-vertical-carousel")))
        });
      }
    });

    let allowScroll = true; // sometimes we want to ignore scroll-related stuff, like when an Observer-based section is transitioning.
    let scrollTimeout = gsap.delayedCall(1, () => (allowScroll = true)).pause(); // controls how long we should wait after an Observer-based animation is initiated before we allow another scroll-related action
    let currentIndex = 0;
    let swipePanels = gsap.utils.toArray(
      ".vertical-carousel .carousel-container .js-slide",
    );

    /* Change background according to active slide **/
  
    function updateSlideColor(carousel) {
      const activeSlides = carousel.querySelectorAll(".js-slide.active, .js-slide.intersecting");
      
      if (!activeSlides.length) return;

      let activeSlide = directionDown ? activeSlides[activeSlides.length - 1] : activeSlides[0];
      
      if (!activeSlide) return;
      
      carousel.setAttribute(
        "data-slide",
        activeSlide.getAttribute("data-slide-index")
      );
    }

    function updateHeaderStep(carousel) {
      const activeStepContainers = document.querySelectorAll(
        "[data-step-container].intersecting",
      );
      const activeStepContainer = directionDown ? activeStepContainers[activeStepContainers.length - 1] : activeStepContainers[0];
      const carouselHeader = carousel.querySelector(".carousel-header");
      const swiperCont = carousel.querySelector(".carousel-container");

      if (activeStepContainer) {
        carouselHeader.setAttribute(
          "data-step",
          activeStepContainer.getAttribute("data-step-container"),
        );
      }
    }
  
    function onTouchStart(e) {
      console.log("touchstart");
      touchStartY = e.touches[0].clientY;
    }
  
    function onTouchEnd(e) {
      console.log("touchend");
      const touchEndY = e.changedTouches[0].clientY;
      const touchDistance = touchEndY - touchStartY;
  
      directionDown = touchDistance < 0;
    }
  
    function onTouchMove(e) {
      console.log("touchmove");
      const touchEndY = e.changedTouches[0].clientY;
      const touchDistance = touchEndY - touchStartY;
  
      directionDown = touchDistance < 0;
  
      onWheel(e, true);
    }

    /* Toggle the header label **/
  
    function onWheel(e, isTouch) {
      if (!isTouch) {
        directionDown = e.deltaY > 0;
      }

      carousels.forEach((carousel) => {
        const carouselJsElem = carousel.querySelector(
          ".js-vertical-scroll-carousel",
        );
        const circleElem = carouselJsElem.querySelector(".circle-gradient");
        const carouselRect = carouselJsElem.getBoundingClientRect();
  
        if (carousel.classList.contains("intersecting")) {
          updateHeaderStep(carousel);
          updateSlideColor(carousel);
        }
      });
    }
  
    window.addEventListener("wheel", onWheel);
    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("touchcancel", onTouchEnd);
    document.addEventListener("touchmove", onTouchMove);

  /* Sliding on scroll: with gsap if window height allows, and native scrolling if not **/
  
  gsap.registerPlugin(ScrollTrigger);
  
  // set z-index levels for the swipe panels
  gsap.set(swipePanels, { zIndex: (i) => swipePanels.length - i });

  // create an observer and disable it to start
  let intentObserver = ScrollTrigger.observe({
    type: "wheel,touch",
    onUp: () => allowScroll && gotoPanel(currentIndex - 1, false),
    onDown: () => allowScroll && gotoPanel(currentIndex + 1, true),
    tolerance: 50,
    preventDefault: true,
    onEnable(self) {
      allowScroll = false;
      scrollTimeout.restart(true);
      // when enabling, we should save the scroll position and freeze it. This fixes momentum-scroll on Macs, for example.
      let savedScroll = self.scrollY();
      self._restoreScroll = () => self.scrollY(savedScroll); // if the native scroll repositions, force it back to where it should be
      document.addEventListener("scroll", self._restoreScroll, {
        passive: false,
      });
    },
    onDisable: (self) =>
      document.removeEventListener("scroll", self._restoreScroll),
  });
  intentObserver.disable();
  
  // handle the panel swipe animations
  function gotoPanel(index, isScrollingDown) {
    // return to normal scroll if we're at the end or back up to the start
    if (
      (index === swipePanels.length && isScrollingDown) ||
      (index === -1 && !isScrollingDown)
    ) {
      intentObserver.disable(); // resume native scroll
      return;
    }
    allowScroll = false;
    scrollTimeout.restart(true);
  
    let target = swipePanels[index];

    gsap.from(target, {
      y: isScrollingDown ? 300 : -300
    });
    gsap.to(target, {
      y: 0,
      ease: "sine.in",
      duration: .5
    });

    swipePanels.forEach((p) => {
        p.classList.remove('active');
    });
  
    currentIndex = index;

    swipePanels[currentIndex].classList.add('active');
  }
  
  // pin swipe section and initiate observer
  const slides = document.querySelectorAll(".vertical-carousel .carousel-container .js-slide");
  const pagesSlides = document.querySelectorAll(".vertical-carousel .carousel-container .js-slide .page-width");

  if ((!ScrollTrigger.isTouch) && window.innerHeight > document.querySelector(".vertical-carousel .carousel-container .js-slide .page-width").clientHeight) {
    swipePanels[0].classList.add('active');

    ScrollTrigger.create({
        trigger: ".vertical-carousel .carousel-container",
        pin: true,
        start: "top top",
        end: "+=200", // just needs to be enough to not risk vibration where a user's fast-scroll shoots way past the end
        onEnter: (self) => {
          if (intentObserver.isEnabled) {
            return;
          } // in case the native scroll jumped past the end and then we force it back to where it should be.
          self.scroll(self.start + 1); // jump to just one pixel past the start of this section so we can hold there.
          intentObserver.enable(); // STOP native scrolling
        },
        onEnterBack: (self) => {
          if (intentObserver.isEnabled) {
            return;
          } // in case the native scroll jumped backward past the start and then we force it back to where it should be.
          self.scroll(self.end - 1); // jump to one pixel before the end of this section so we can hold there.
          intentObserver.enable(); // STOP native scrolling
        },
      });    
  } else {
    slides.forEach(slide => {
        slide.style.position = 'relative';
        if (window.isElementInViewport) {
            isElementInViewport(slide, window.innerHeight > 800 ? 0.5 : 0.4, () => {
              updateSlideColor(slide.closest('.section-vertical-carousel'))
            });
        }
    });
  }
});
  