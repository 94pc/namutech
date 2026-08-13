// DOM Elements
const header = document.getElementById('header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenuCloseBtn = document.querySelector('.mobile-menu-close-btn');
const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// 1. Scroll Effect - Sticky Header Transition
const handleScroll = () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleScroll);

// Initial check in case of page refresh while scrolled
handleScroll();

// 2. Mobile Menu Toggle
const openMobileMenu = () => {
  mobileNavOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

const closeMobileMenu = () => {
  mobileNavOverlay.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
};

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', openMobileMenu);
}

if (mobileMenuCloseBtn) {
  mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
}

// Close mobile menu when a link is clicked
mobileNavLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close mobile menu if clicked outside the content area
mobileNavOverlay.addEventListener('click', (e) => {
  if (e.target === mobileNavOverlay) {
    closeMobileMenu();
  }
});

// 3. Online Estimate Form Submission (구글 스프레드시트 연동)
document.addEventListener('DOMContentLoaded', () => {
  const quoteForm = document.getElementById('quote-form');
  if (!quoteForm) return;

  // 예산 범위 실시간 천 단위 콤마(,) 추가 로직
  const budgetInput = document.getElementById('quote-budget');
  if (budgetInput) {
    budgetInput.addEventListener('input', (e) => {
      let value = e.target.value;
      // 숫자 이외의 문자 제거
      value = value.replace(/[^0-9]/g, '');
      // 천 단위 콤마 추가
      if (value) {
        value = Number(value).toLocaleString('ko-KR');
      }
      e.target.value = value;
    });
  }

  const submitBtn = document.getElementById('quote-submit-btn');
  const loadingOverlay = document.getElementById('loading-overlay');
  const successModal = document.getElementById('success-modal');
  const errorModal = document.getElementById('error-modal');
  const closeSuccessBtn = document.getElementById('close-success-btn');
  const closeErrorBtn = document.getElementById('close-error-btn');

  // [중요] 구글 스프레드시트 Apps Script 배포 후 발급받은 '웹 앱 URL'을 아래 홀더에 입력해 주세요.
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyqHz15cjRKEjHP-_Yrsjz2eDoHYDvXROdTyL8uY58WnMYRas-zy9airnwcDfI47jZo/exec'; 

  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 개인정보 약관 동의 체크 검증
    const agreementCheckbox = document.getElementById('quote-agreement');
    if (!agreementCheckbox || !agreementCheckbox.checked) {
      alert('개인정보 수집 및 이용 조항에 동의해 주셔야 견적신청이 가능합니다.');
      return;
    }

    // 입력 폼 데이터 수집
    const formData = new FormData(quoteForm);
    const payload = {
      name: formData.get('name').trim(),
      phone: formData.get('phone').trim(),
      email: formData.get('email').trim(),
      category: formData.get('category'),
      budget: formData.get('budget').trim() || '미지정',
      message: formData.get('message').trim()
    };

    // 구글 연동 URL 미지정 시 시뮬레이션 모드 작동 (로컬/테스트 검증용)
    if (!WEB_APP_URL) {
      console.warn('Google Apps Script URL이 설정되지 않았습니다. 테스트 시뮬레이션을 실행합니다.');
      loadingOverlay.classList.remove('hidden');
      submitBtn.disabled = true;

      setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        submitBtn.disabled = false;
        successModal.classList.remove('hidden');
        quoteForm.reset();
      }, 1500);
      return;
    }

    // 실제 전송 시작
    loadingOverlay.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
      // CORS preflight를 피하기 위해 Content-Type을 text/plain으로 설정해 전송합니다.
      // 구글 Apps Script의 doPost(e)는 이 형식의 JSON 문자열을 수용하여 정상 파싱합니다.
      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      loadingOverlay.classList.add('hidden');
      submitBtn.disabled = false;

      if (result.result === 'success') {
        successModal.classList.remove('hidden');
        quoteForm.reset();
      } else {
        console.error('Apps Script Error Response:', result.error);
        errorModal.classList.remove('hidden');
      }
    } catch (error) {
      console.error('Network Fetch Error:', error);
      loadingOverlay.classList.add('hidden');
      submitBtn.disabled = false;
      errorModal.classList.remove('hidden');
    }
  });

  // 성공 모달 닫기
  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
    });
  }

  // 실패 모달 닫기
  if (closeErrorBtn) {
    closeErrorBtn.addEventListener('click', () => {
      errorModal.classList.add('hidden');
    });
  }
});

// 4. Portfolio Gallery Page Logic (카테고리 필터링 및 라이트박스 팝업)
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('lightbox-modal');
  
  // 갤러리 기능이 있는 페이지에서만 작동
  if (filterBtns.length === 0 || galleryCards.length === 0) return;

  // 카테고리 필터링 탭 제어
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. 활성 탭 스타일 전환
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // 2. 카드 필터링 표시/숨김
      const filterValue = btn.getAttribute('data-filter');
      galleryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 라이트박스 팝업 제어
  const lightboxImg = document.getElementById('lightbox-img');
  const closeLightboxBtn = document.getElementById('lightbox-close-btn');

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgEl = card.querySelector('.card-img-box img');
      
      if (imgEl && lightbox && lightboxImg) {
        // 이미지 소스 설정
        lightboxImg.src = imgEl.src;
        lightboxImg.alt = imgEl.alt;

        // 모달 표시
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // 뒷배경 스크롤 방지
      }
    });
  });

  // 라이트박스 닫기 기능
  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.add('hidden');
      document.body.style.overflow = ''; // 스크롤 원복
      if (lightboxImg) lightboxImg.src = '';
    }
  };

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    // 반투명 블랙 배경 클릭 시에도 닫기
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // ESC 키 눌렀을 때 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
        closeLightbox();
      }
    });
  }
});


