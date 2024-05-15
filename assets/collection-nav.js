document.addEventListener('DOMContentLoaded', () => {
    // COLLECTION NAVBAR

    const allSection = document.querySelectorAll('.collection-product');
    const navItems = document.querySelectorAll('.collection-nav__item');
    const navBlocks = document.querySelectorAll('.collection-nav__block');
    const navPanel = document.querySelector('.collection-nav');
    const headerHidden = document.querySelector('.section-header');
    
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight =
            window.innerHeight || document.documentElement.clientHeight;
        const elementHeight = rect.bottom - rect.top;

        return (
            rect.top + elementHeight * 0.4 <= windowHeight &&
            rect.bottom - elementHeight * 0.4 >= 0
        );
    }

    function removeActiveParent() {
        navBlocks.forEach((block) => {
            block.classList.remove('active');
        });
    }

    function activeNavItem(attr) {
        navItems.forEach((item) => {
            let parent = item.parentElement;
            if (attr == item.getAttribute('data-nav-item')) {
                item.classList.add('active');
                removeActiveParent();
                parent.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function checkScroll() {
        allSection.forEach((section) => {
            if (isElementInViewport(section)) {
                let attr = section.getAttribute('data-target');
                activeNavItem(attr);
            }
        });
    }

    checkScroll();
    window.addEventListener('scroll', checkScroll);

    window.addEventListener('scroll', function () {
        const scrolled = window.scrollY;
        if(scrolled > 144.99){
            navPanel.classList.add('scrolled');
        } else if (scrolled < 144.99 ){
            navPanel.classList.remove('scrolled');
        }
    });

    function checkInitialScroll(){
       if(window.scrollY > 144.99){
            headerHidden.classList.remove('shopify-section-header-hidden');
            headerHidden.classList.add('shopify-section-header-sticky');
            headerHidden.classList.add('animate');
        }
    }

    checkInitialScroll();

    function scroll(index) {
        let scroll;
        switch (index) {
            case 0:
                scroll = 0;
                break;
            case 1:
                scroll = 180;
                break;
            case 2:
                scroll = 320;
                break;
            case 3:
                scroll = 460;
                break;
            case 4:
                scroll = 600;
                break;
            case 5:
                scroll = 740;
                break;
            case 6:
                scroll = 920;
                break;
        }

        navPanel.scrollLeft = scroll;
    }

    function navBarScroll() {
    navItems.forEach((item, index) => {
        if (item.classList.contains('active')) {
        scroll(index);
        }
      });
    }

    if(window.innerWidth < 1200){
        window.addEventListener('scroll', navBarScroll);
    }


    const links = document.querySelectorAll('.collection-nav__item');

    function scrollToSection(sectionId, event) {
        const targetSection = document.querySelector(`[data-target="${sectionId}"]`);
        const currentScroll = window.scrollY;
        const scrollDirection = currentScroll < targetSection.offsetTop ? 'down' : 'up';
      
        let offset = 50;
        if (scrollDirection === 'up') {
          offset = 100;
        }
      
        event.preventDefault();
        window.scrollTo({
          top: targetSection.offsetTop - offset,
          behavior: 'smooth'
        });
      }
      
      links.forEach((link) => {
        link.addEventListener('click', (e) => {
          scrollToSection(link.getAttribute('data-nav-item'), e);
        });
    });
 

    // END COLLECTION NAVBAR
});
