/**
 * @param {Event} event 
 */
function openSchoolModal(event) {
  
  if (event) {
    event.preventDefault();
  }
  
  const modal = document.getElementById('school-list-modal');
  if (modal) {
    modal.classList.remove('hidden');
   
    document.body.style.overflow = 'hidden'; 
  }
}


// ============================================================
//  頁面載入後執行的主要腳本
// ============================================================
window.addEventListener('load', () => {
      // --- 1. AOS Initialization ---
      AOS.init({
        duration: 800,
        once: true,
        offset: 100,
      });

      // --- 2. Prize Modal Logic (點擊外部關閉功能) ---
      const prizeModal = document.getElementById('prize-modal');
      const closeBtn = document.getElementById('prize-modal-close-btn');
      const ctaBtn = document.getElementById('prize-modal-cta');

      // 確保所有需要的元素都存在
      if (prizeModal && closeBtn && ctaBtn) {
        // Function to close the modal
        const closeModal = () => {
          prizeModal.classList.add('hidden');
          document.body.style.overflow = ''; // Restore background scrolling
          // Set a flag in sessionStorage so it doesn't show again on refresh
          sessionStorage.setItem('prizeModalShown', 'true');
        };

        // Show modal only if the flag is not set in sessionStorage
        if (!sessionStorage.getItem('prizeModalShown')) {
          prizeModal.classList.remove('hidden');
          document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        // Add event listeners to elements that should close the modal
        closeBtn.addEventListener('click', closeModal);
        ctaBtn.addEventListener('click', closeModal); // CTA also closes the modal before scrolling

        // 點擊 modal 背景區域時關閉
        prizeModal.addEventListener('click', (event) => {
          // 確保點擊的是背景本身 (prizeModal)，而不是其子元素 (modal 內容)
          if (event.target === prizeModal) {
            closeModal();
          }
        });
      }

      // --- 3. Navbar & Mobile Menu Logic ---
      const nav = document.getElementById('main-nav');
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      const mobileMenu = document.getElementById('mobile-menu');
      const hamburgerIcon = document.getElementById('hamburger-icon');
      const closeIcon = document.getElementById('close-icon');
      const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

      if (nav) {
        window.addEventListener('scroll', () => {
          nav.classList.toggle('scrolled', window.scrollY > 50);
        });
      }

      if (mobileMenuButton && mobileMenu && hamburgerIcon && closeIcon) {
        mobileMenuButton.addEventListener('click', () => {
          const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
          mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
          mobileMenu.classList.toggle('hidden');
          hamburgerIcon.classList.toggle('hidden');
          closeIcon.classList.toggle('hidden');
        });
      }
      
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (mobileMenu && hamburgerIcon && closeIcon && mobileMenuButton) {
            mobileMenu.classList.add('hidden');
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
          }
        });
      });

      // --- 4. Accordion Logic (General) ---
      document.querySelectorAll('.accordion-trigger, #terms-accordion-button').forEach(trigger => {
        const content = trigger.nextElementSibling;
        const icon = trigger.querySelector('.accordion-icon');
        if (content) {
            trigger.addEventListener('click', () => {
              const isOpen = content.classList.contains('open');
              if (isOpen) {
                  content.style.maxHeight = null;
              } else {
                  content.style.maxHeight = content.scrollHeight + 'px';
              }
              content.classList.toggle('open');
              if (icon) icon.classList.toggle('open');
              if (trigger.hasAttribute('aria-expanded')) {
                  trigger.setAttribute('aria-expanded', !isOpen);
              }
            });
        }
      });
      document.querySelectorAll('.accordion-content.open').forEach(openContent => {
        openContent.style.maxHeight = openContent.scrollHeight + 'px';
      });

      // --- 5. Phase Tabs Logic ---
      const phaseTabs = document.querySelectorAll('.phase-tab');
      phaseTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = document.querySelector(tab.dataset.target);
          document.querySelectorAll('.phase-tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.phase-content').forEach(c => c.classList.remove('active'));
          tab.classList.add('active');
          if (target) target.classList.add('active');
          setTimeout(() => AOS.refresh(), 400);
        });
      });

      // --- 6. Modal Logic (Elite Pass) ---
      const openPassModalBtn = document.getElementById('open-pass-modal');
      const closePassModalBtn = document.getElementById('close-pass-modal');
      const passModal = document.getElementById('pass-modal');
      if (passModal) {
          const openModal = () => { passModal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; };
          const closeModal = () => { passModal.classList.add('hidden'); document.body.style.overflow = ''; };
          if (openPassModalBtn) openPassModalBtn.addEventListener('click', openModal);
          if (closePassModalBtn) closePassModalBtn.addEventListener('click', closeModal);
          passModal.addEventListener('click', (e) => { if (e.target === passModal) closeModal(); });
          document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !passModal.classList.contains('hidden')) closeModal(); });
      }

      // --- 7. Countdown Timer Logic ---
      const countdownContainer = document.getElementById('countdown-timer');
      if (countdownContainer) {
        const countdownEndDate = new Date('2025-10-21T00:00:00+08:00').getTime();
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        if (daysEl && hoursEl && minutesEl && secondsEl) {
            const timerInterval = setInterval(() => {
                const distance = countdownEndDate - new Date().getTime();
                if (distance < 0) {
                    clearInterval(timerInterval);
                    countdownContainer.innerHTML = '<div class="text-2xl font-bold text-red-500">報名已截止，敬請期待下屆賽事！</div>';
                    return;
                }
                const format = (num) => String(num).padStart(2, '0');
                daysEl.innerText = format(Math.floor(distance / 86400000));
                hoursEl.innerText = format(Math.floor((distance % 86400000) / 3600000));
                minutesEl.innerText = format(Math.floor((distance % 3600000) / 60000));
                secondsEl.innerText = format(Math.floor((distance % 60000) / 1000));
            }, 1000);
        }
      }

      // --- 8. Swiper Initialization ---
      if (typeof Swiper !== 'undefined') {
        new Swiper('.review-swiper', {
          loop: true,
          autoplay: { delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true },
          pagination: { el: '.swiper-pagination', clickable: true },
          navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
          slidesPerView: 1, spaceBetween: 15,
          breakpoints: { 640: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 30 } },
        });
      }

      // --- 9. Champion Card 3D Tilt Effect ---
      document.querySelectorAll('.champion-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            const { width, height } = rect;
            const rotateX = ((y - height / 2) / (height / 2)) * -10;
            const rotateY = ((x - width / 2) / (width / 2)) * 10;
            card.style.setProperty('--rotateX', `${rotateX}deg`);
            card.style.setProperty('--rotateY', `${rotateY}deg`);
        });
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rotateX', '0deg');
            card.style.setProperty('--rotateY', '0deg');
        });
      });

      // --- 10. School List Modal Logic  ---
      
      const closeSchoolModalBtn = document.getElementById('close-school-modal-button');
      const schoolListModal = document.getElementById('school-list-modal');
      if (schoolListModal) {
          const closeModal = () => { schoolListModal.classList.add('hidden'); document.body.style.overflow = ''; };
          if (closeSchoolModalBtn) closeSchoolModalBtn.addEventListener('click', closeModal);
          schoolListModal.addEventListener('click', (e) => { if (e.target === schoolListModal) closeModal(); });
          document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !schoolListModal.classList.contains('hidden')) closeModal(); });
      }

      // --- 11. FAQ Accordion Logic ---
      document.querySelectorAll('.faq-item').forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');
        if (trigger && content && icon) {
          trigger.addEventListener('click', () => {
            const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
            document.querySelectorAll('.faq-item').forEach(otherItem => {
              if (otherItem !== item) {
                otherItem.querySelector('.faq-content').style.maxHeight = null;
                otherItem.querySelector('.faq-icon').classList.remove('rotate-180');
              }
            });
            content.style.maxHeight = isOpen ? null : content.scrollHeight + 'px';
            icon.classList.toggle('rotate-180', !isOpen);
          });
        }
      });
});