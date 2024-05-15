document.addEventListener("DOMContentLoaded", () => {
  const menuDrawer = document.getElementById("menu-drawer-trigger");
  const drawerClose = document.getElementById("drawer-close");
  function openMenuDrawer() {
    const header = document.getElementById("header");
    header.classList.add("menu-drawer-active");
    menuDrawer.style.display = "none";
  }
  function closeMenuDrawer() {
    const drawerOpen = document.getElementById("Details-menu-drawer-container");
    const body = document.getElementById("body");
    const header = document.getElementById("header");
    const summaryAria = document.getElementById("summary-aria");
    const sectionHeader = document.querySelector(".section-header");
    header.classList.remove("menu-drawer-active");
    menuDrawer.style.display = "block";
    drawerOpen.removeAttribute("open");
    summaryAria.removeAttribute("aria-expanded");
    body.classList.remove("overflow-hidden-tablet");
    sectionHeader.classList.remove("menu-open");
  }
  menuDrawer.addEventListener("click", () => {
    openMenuDrawer();
  });
  drawerClose.addEventListener("click", () => {
    closeMenuDrawer();
  });
  //  Form submissiob handle
  (() => {
    const FORM_SUBMITTED_CLASS = "form--submitted";
    document.querySelectorAll('form [type="submit"]').forEach(submit => {
      submit.addEventListener("click", () => {
        submit.closest("form").classList.add(FORM_SUBMITTED_CLASS);
      });
    });
  })();
});
// Animated button
const animatedBtn = document.querySelectorAll(".animated");
animatedBtn.forEach(btn => {
  btn.onmousemove = e => {
    const x = e.pageX - e.target.offsetLeft;
    const y = e.pageY - e.target.offsetTop;
    e.target.style.setProperty("--x", `${x}px`);
    e.target.style.setProperty("--y", `${y}px`);
  };
});
// OUR SCIENCE MODAL
const modalClose = document.querySelectorAll(".our-science__modal-close");
const scienceModal = document.querySelectorAll(".our-science__modal");
const zoomTrigger = document.querySelectorAll(".our-science__zoom");
zoomTrigger.forEach(item => {
  item.addEventListener("click", () => {
    scienceModal.forEach(modal => {
      if (modal.getAttribute("data-modal") == item.getAttribute("data-zoom")) {
        modal.style.display = "block";
      }
    });
  });
});
modalClose.forEach(item => {
  item.addEventListener("click", () => {
    scienceModal.forEach(modal => {
      modal.style.display = "none";
    });
  });
});
// AJAX BLOG PAGINATION
document.addEventListener("DOMContentLoaded", function () {
  const preloader = document.getElementById("preloader");
  function showPreloader() {
    preloader.style.display = "flex";
  }
  function hidePreloader() {
    preloader.style.display = "none";
  }
  function fetchAjax(event) {
    showPreloader();
    let page = event.target.getAttribute("data-href");
    if (page !== null) {
      fetch(page)
        .then(response => response.text())
        .then(data => {
          const parser = new DOMParser();
          let newDom = parser.parseFromString(data, "text/html");
          document
            .querySelector("#BlogArticles")
            .replaceWith(newDom.querySelector("#BlogArticles"));
          ajaxPagination();
          hidePreloader(); // Перенесено сюда, чтобы скрыть прелоадер после завершения запроса
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          hidePreloader(); // Скрыть прелоадер в случае ошибки
        });
    }
  }
  function ajaxPagination() {
    document.querySelectorAll(".pagination__item").forEach(function (el) {
      el.addEventListener("click", fetchAjax);
    });
  }
  ajaxPagination();
});
// DELETE FORM TEXT
document.addEventListener("DOMContentLoaded", function () {
  const deleteButtons = document.querySelectorAll(".delete-text");
  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const closestInput = button
        .closest("div")
        .querySelector("input, textarea");
      if (closestInput) {
        closestInput.value = "";
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
   const menuDrawer = document.getElementById("menu-drawer-trigger");
   const drawerClose = document.getElementById("drawer-close");
   function openMenuDrawer() {
    const header = document.getElementById("header");
     header.classList.add("menu-drawer-active");
    menuDrawer.style.display = "none";
   }
   function closeMenuDrawer() {
     const drawerOpen = document.getElementById("Details-menu-drawer-container");
     const body = document.getElementById("body");
     const header = document.getElementById("header");
     const summaryAria = document.getElementById("summary-aria");
     const sectionHeader = document.querySelector(".section-header");
    header.classList.remove("menu-drawer-active");
     menuDrawer.style.display = "block";
     drawerOpen.removeAttribute("open");
     summaryAria.removeAttribute("aria-expanded");
     body.classList.remove("overflow-hidden-tablet");
     sectionHeader.classList.remove("menu-open");
   }
   menuDrawer.addEventListener("click", () => {
     openMenuDrawer();
   });
   drawerClose.addEventListener("click", () => {
    closeMenuDrawer();
   });
   //  Form submissiob handle
   (() => {
     const FORM_SUBMITTED_CLASS = "form--submitted";
     document.querySelectorAll('form [type="submit"]').forEach(submit => {
       submit.addEventListener("click", () => {
         submit.closest("form").classList.add(FORM_SUBMITTED_CLASS);
      });
    });
   })();
});

// RECHARGER WIDGET

const rechargeWidget = document.getElementById('recharge-widget');
const formInput = document.querySelector('.pdp__buy--btns__wrapper input[name="selling_plan"]');
if (rechargeWidget) {
  const rechargeOptions = rechargeWidget.querySelectorAll('.recharge-widget__input');
  function checkInputs(){
      rechargeOptions.forEach((input) => {
          if(input.checked){
            formInput.value = input.value;
          }
      });
  }

  rechargeOptions.forEach((input) => {
     input.addEventListener('change', ()=>{checkInputs()});
  });

  checkInputs();
}


window.isElementInViewport = (element, th, cb) => {
  var elementFits = window.innerHeight > element.offsetHeight;
  var threshold = elementFits ? th || 0.3 : th || 0.1;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.intersectionRatio >= threshold) {
          element.classList.add('intersecting');
          cb && cb();
          requestAnimationFrame(() => {
            element.querySelectorAll('animate').forEach(function(an) {
              an.beginElement();
            });
          });
      } else {
          element.classList.remove('intersecting');
      }
      element.setAttribute('data-intersection-ratio', entry.intersectionRatio);
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold
  });

  observer.observe(element);
}

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.shopify-section');

  sections.forEach((section) => {
    window.isElementInViewport(section, 0.05);
  });
});


// WAIT LIST POP UP

const waitlistPopUp = document.querySelector('.waitlist-pop-up');
if(waitlistPopUp){
  const waitlistPopUpClose = document.querySelector('.waitlist-pop-up__close');
  const popUpTrigger = document.querySelectorAll('.pdp__pop-up-waiting-list p a, .collection-product__label, .pdp__product--label, .coming_soon_buttons')

  waitlistPopUpClose.addEventListener('click', ()=>{
      waitlistPopUp.classList.add('pop-up-hidden');
  });

  popUpTrigger.forEach((trigger) => {
    trigger.addEventListener('click', (e)=>{
      e.preventDefault();
      waitlistPopUp.classList.remove('pop-up-hidden');
    });
  })
}














