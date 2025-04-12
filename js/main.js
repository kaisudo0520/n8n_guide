// 導航功能
document.addEventListener('DOMContentLoaded', function() {
  // 移動端菜單切換
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }
  
  // 點擊頁面其他地方關閉菜單
  document.addEventListener('click', function(event) {
    if (navMenu && navMenu.classList.contains('active') && !event.target.closest('nav') && !event.target.closest('.mobile-menu-btn')) {
      navMenu.classList.remove('active');
    }
  });
  
  // 平滑滾動
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // 如果在移動端，點擊後關閉菜單
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
        }
      }
    });
  });
  
  // 目錄高亮
  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('.sidebar a');
  
  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', function() {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }
  
  // 設置當前頁面導航高亮
  const currentPath = window.location.pathname;
  const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || 
        (currentPage === '' && linkHref === 'index.html') ||
        (currentPage !== '' && linkHref.includes(currentPage))) {
      link.classList.add('active');
    }
  });
  
  // 添加麵包屑導航
  const breadcrumbContainer = document.querySelector('.breadcrumb-container');
  if (breadcrumbContainer) {
    const breadcrumbs = [];
    
    // 添加首頁
    breadcrumbs.push('<a href="index.html">首頁</a>');
    
    // 根據當前頁面添加麵包屑
    if (currentPage && currentPage !== 'index.html') {
      let pageName = '';
      
      if (currentPage === 'learning-path.html') {
        pageName = '學習路徑';
      } else if (currentPage === 'basic-tutorial.html') {
        pageName = '基礎教學';
      } else if (currentPage === 'intermediate-tutorial.html') {
        pageName = '中級教學';
      } else if (currentPage === 'advanced-tutorial.html') {
        pageName = '進階教學';
      } else if (currentPage === 'use-cases.html') {
        pageName = '實用案例';
      } else if (currentPage.includes('use-case-')) {
        breadcrumbs.push('<a href="use-cases.html">實用案例</a>');
        
        if (currentPage === 'use-case-social-media.html') {
          pageName = '社群媒體自動化';
        } else if (currentPage === 'use-case-immersive-translation.html') {
          pageName = '吳恩達三階段沉浸式翻譯';
        } else if (currentPage === 'use-case-customer-service-bot.html') {
          pageName = '自動客服機器人';
        }
      } else if (currentPage === 'resources.html') {
        pageName = '資源';
      }
      
      if (pageName) {
        breadcrumbs.push(`<span>${pageName}</span>`);
      }
    }
    
    breadcrumbContainer.innerHTML = breadcrumbs.join(' &gt; ');
  }
});

// 搜索功能
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput || !searchResults) return;
  
  // 獲取所有內容區塊
  const contentSections = document.querySelectorAll('.content-section');
  let searchIndex = [];
  
  // 建立搜索索引
  contentSections.forEach(section => {
    const sectionId = section.getAttribute('id');
    const sectionTitle = section.querySelector('h2, h3')?.textContent || '';
    const sectionContent = section.textContent;
    
    // 將段落分割為較小的塊
    const paragraphs = section.querySelectorAll('p, li, h3, h4, h5');
    
    paragraphs.forEach(paragraph => {
      searchIndex.push({
        id: sectionId,
        title: sectionTitle,
        subtitle: paragraph.tagName === 'H3' || paragraph.tagName === 'H4' || paragraph.tagName === 'H5' ? paragraph.textContent : '',
        content: paragraph.textContent,
        element: paragraph
      });
    });
  });
  
  // 搜索功能
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    
    if (query.length < 2) {
      searchResults.innerHTML = '';
      searchResults.style.display = 'none';
      return;
    }
    
    // 過濾匹配的結果
    const results = searchIndex.filter(item => {
      return item.title.toLowerCase().includes(query) || 
             item.subtitle.toLowerCase().includes(query) || 
             item.content.toLowerCase().includes(query);
    }).slice(0, 10); // 限制結果數量
    
    // 顯示結果
    if (results.length > 0) {
      searchResults.innerHTML = '';
      results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        
        const resultLink = document.createElement('a');
        resultLink.href = `#${result.id}`;
        
        const title = document.createElement('div');
        title.className = 'search-result-title';
        title.textContent = result.title;
        
        const subtitle = result.subtitle ? document.createElement('div') : null;
        if (subtitle) {
          subtitle.className = 'search-result-subtitle';
          subtitle.textContent = result.subtitle;
        }
        
        const snippet = document.createElement('div');
        snippet.className = 'search-result-snippet';
        // 截取包含查詢詞的上下文
        const contentText = result.content;
        const queryIndex = contentText.toLowerCase().indexOf(query);
        const startIndex = Math.max(0, queryIndex - 50);
        const endIndex = Math.min(contentText.length, queryIndex + query.length + 50);
        let snippetText = contentText.substring(startIndex, endIndex);
        if (startIndex > 0) snippetText = '...' + snippetText;
        if (endIndex < contentText.length) snippetText = snippetText + '...';
        
        // 高亮查詢詞
        const highlightedText = snippetText.replace(
          new RegExp(query, 'gi'),
          match => `<strong>${match}</strong>`
        );
        snippet.innerHTML = highlightedText;
        
        resultLink.appendChild(title);
        if (subtitle) resultLink.appendChild(subtitle);
        resultLink.appendChild(snippet);
        resultItem.appendChild(resultLink);
        
        resultLink.addEventListener('click', function(e) {
          e.preventDefault();
          
          // 滾動到結果位置
          result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // 高亮顯示結果
          result.element.classList.add('search-highlight');
          setTimeout(() => {
            result.element.classList.remove('search-highlight');
          }, 3000);
          
          // 清空搜索
          searchInput.value = '';
          searchResults.innerHTML = '';
          searchResults.style.display = 'none';
        });
        
        searchResults.appendChild(resultItem);
      });
      
      searchResults.style.display = 'block';
    } else {
      searchResults.innerHTML = '<div class="search-result-item no-results">沒有找到匹配的結果</div>';
      searchResults.style.display = 'block';
    }
  });
  
  // 點擊頁面其他地方關閉搜索結果
  document.addEventListener('click', function(event) {
    if (!event.target.closest('#search-container')) {
      searchResults.innerHTML = '';
      searchResults.style.display = 'none';
    }
  });
  
  // 添加搜索快捷鍵 (Ctrl+K 或 Command+K)
  document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      searchInput.focus();
    }
    
    // ESC 鍵關閉搜索結果
    if (event.key === 'Escape') {
      searchInput.value = '';
      searchResults.innerHTML = '';
      searchResults.style.display = 'none';
      searchInput.blur();
    }
  });
}

// 代碼高亮
function initCodeHighlight() {
  document.querySelectorAll('pre code').forEach(block => {
    hljs.highlightBlock(block);
  });
  
  // 添加複製代碼按鈕
  document.querySelectorAll('pre').forEach(pre => {
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-btn';
    copyButton.textContent = '複製';
    
    pre.style.position = 'relative';
    pre.appendChild(copyButton);
    
    copyButton.addEventListener('click', function() {
      const code = pre.querySelector('code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyButton.textContent = '已複製!';
        setTimeout(() => {
          copyButton.textContent = '複製';
        }, 2000);
      }).catch(err => {
        console.error('無法複製代碼: ', err);
      });
    });
  });
}

// 圖片延遲加載
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // 回退方案
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// 返回頂部按鈕
function initBackToTop() {
  const backToTopBtn = document.createElement('button');
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.innerHTML = '&#8679;';
  backToTopBtn.title = '返回頂部';
  document.body.appendChild(backToTopBtn);
  
  // 顯示/隱藏按鈕
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });
  
  // 點擊返回頂部
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 暗黑模式切換
function initDarkMode() {
  const darkModeToggle = document.getElementById('dark-mode-toggle-input');
  if (!darkModeToggle) return;
  
  // 檢查用戶偏好
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedMode = localStorage.getItem('darkMode');
  
  // 設置初始模式
  if (savedMode === 'dark' || (savedMode === null && prefersDarkMode)) {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
  }
  
  // 切換模式
  darkModeToggle.addEventListener('change', function() {
    if (this.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'light');
    }
  });
}

// 目錄生成
function initTableOfContents() {
  const tocContainer = document.getElementById('toc-container');
  if (!tocContainer) return;
  
  const headings = document.querySelectorAll('.main-content h2, .main-content h3, .main-content h4');
  if (headings.length === 0) return;
  
  const toc = document.createElement('ul');
  toc.className = 'toc-list';
  
  let currentList = toc;
  let previousLevel = 2;
  
  headings.forEach(heading => {
    // 獲取標題級別
    const level = parseInt(heading.tagName.charAt(1));
    
    // 如果沒有 id，添加一個
    if (!heading.id) {
      heading.id = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }
    
    // 創建目錄項
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    listItem.appendChild(link);
    
    // 處理不同級別的標題
    if (level > previousLevel) {
      // 創建子列表
      const subList = document.createElement('ul');
      currentList.lastChild.appendChild(subList);
      currentList = subList;
    } else if (level < previousLevel) {
      // 返回上一級
      for (let i = 0; i < previousLevel - level; i++) {
        if (currentList.parentNode && currentList.parentNode.parentNode) {
          currentList = currentList.parentNode.parentNode;
        } else {
          break; // 防止進一步訪問 null 對象
        }
      }
    }
    
    currentList.appendChild(listItem);
    previousLevel = level;
  });
  
  tocContainer.appendChild(toc);
}

// 添加進度指示器
function initProgressIndicator() {
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', function() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
    progressBar.style.width = scrollPercentage + '%';
  });
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
  initSearch();
  initCodeHighlight();
  initLazyLoading();
  initBackToTop();
  initDarkMode();
  initTableOfContents();
  initProgressIndicator();
  
  // 添加頁面載入動畫
  document.body.classList.add('loaded');
  
  // 添加CSS類到代碼塊
  document.querySelectorAll('.copy-code-btn').forEach(btn => {
    btn.style.position = 'absolute';
    btn.style.top = '5px';
    btn.style.right = '5px';
    btn.style.padding = '5px 10px';
    btn.style.fontSize = '12px';
    btn.style.background = 'rgba(255, 255, 255, 0.7)';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
  });
  
  // 添加搜索提示
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.setAttribute('placeholder', '搜索內容... (Ctrl+K)');
  }
});

// 添加頁面載入時間測量
window.addEventListener('load', function() {
  const loadTime = performance.now();
  console.log(`頁面載入時間: ${loadTime.toFixed(2)}ms`);
});
