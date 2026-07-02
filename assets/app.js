function setupTabs() {
  const tabRoots = document.querySelectorAll("[data-tabs]");

  tabRoots.forEach((root) => {
    const buttons = Array.from(root.querySelectorAll("[role='tab']"));
    const panels = Array.from(root.querySelectorAll("[role='tabpanel']"));

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("aria-controls");

        buttons.forEach((item) => {
          item.setAttribute("aria-selected", String(item === button));
        });

        panels.forEach((panel) => {
          panel.hidden = panel.id !== targetId;
        });
      });
    });
  });
}

function setupTocTabLinks() {
  const links = document.querySelectorAll("[data-tab-target]");

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.dataset.tabTarget;
      const button = document.querySelector(`[role='tab'][aria-controls='${targetId}']`);
      const stageButton = document.querySelector(`[data-stage-filter='${targetId}']`);

      if (button) {
        button.click();
      }

      if (stageButton) {
        stageButton.click();
      }
    });
  });
}

function setupProgramFilters() {
  const pickers = document.querySelectorAll("[data-program-picker]");

  pickers.forEach((picker) => {
    const scope = picker.dataset.pickerScope;
    const buttons = Array.from(picker.querySelectorAll("[data-program-filter]"));
    const cards = Array.from(document.querySelectorAll(`[data-program-scope='${scope}'][data-program-card]`));

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.programFilter;

        buttons.forEach((item) => {
          item.setAttribute("aria-pressed", String(item === button));
        });

        cards.forEach((card) => {
          card.hidden = filter !== "all" && card.dataset.programCard !== filter;
        });
      });
    });
  });
}

function setupProgramStageGuide() {
  const guide = document.querySelector("[data-program-stage-guide]");

  if (!guide) {
    return;
  }

  const stageButtons = Array.from(guide.querySelectorAll("[data-stage-filter]"));
  const programButtons = Array.from(guide.querySelectorAll("[data-program-filter]"));
  const cards = Array.from(guide.querySelectorAll("[data-program-stages]"));
  const note = guide.querySelector("[data-stage-note]");
  const stageTitle = guide.querySelector("[data-stage-title]");
  const stageKind = guide.querySelector("[data-stage-kind]");
  const summaryStates = Array.from(guide.querySelectorAll("[data-filter-summary]"));
  let activeStage = null;
  const notes = {
    "stage-1": "안내 페이지는 학생이 읽고 따라갈 수업 안내판입니다. Classroom/LMS 공지로 충분한지 먼저 보고, 부족할 때 Canva AI/웹페이지와 Google Sites를 확인합니다.",
    "stage-2": "상호작용 활동은 학생이 누르고 확인하는 수업 기능입니다. 정형 퀴즈는 Kahoot/Quizizz/Wordwall을 먼저 검토하고, 맞춤 화면이 필요할 때 Canva AI, Genially, HTML/JavaScript를 비교합니다.",
    "stage-3": "응답·관리는 학생 신청, 피드백, 활동 완료 여부를 모으는 수업 기능입니다. 단순 수집은 Forms/Tally, 현황 관리는 Sheets/AppSheet처럼 더 단순한 도구부터 확인합니다.",
    "stage-5": "웹 배포는 HTML 파일을 학생이 주소로 열 수 있게 하는 운영 기반입니다. Canva나 Google Sites처럼 자체 게시가 되면 배포 도구를 따로 쓸 필요가 없습니다.",
    "stage-6": "웹앱 확장은 단순 안내 페이지를 여러 화면, 필터, 대시보드처럼 운영하는 기반입니다. 기존 앱으로 충분하지 않은 프로젝트형 웹앱을 관리해야 할 때만 Vercel과 Cloudflare Pages를 확인합니다.",
    "stage-7": "데이터 저장은 학생 응답이나 활동 기록을 웹페이지가 기억하게 하는 운영 기반입니다. Forms/Tally, Sheets/AppSheet로 충분한지 먼저 보고 Supabase, Firebase는 개인정보 위험도까지 비교합니다."
  };
  const stageKinds = {
    "stage-1": "수업 기능",
    "stage-2": "수업 기능",
    "stage-3": "수업 기능",
    "stage-5": "운영 기반",
    "stage-6": "운영 기반",
    "stage-7": "운영 기반"
  };
  const stageNames = {
    "stage-1": "안내 페이지",
    "stage-2": "상호작용 활동",
    "stage-3": "응답·관리",
    "stage-5": "웹 배포",
    "stage-6": "웹앱 확장",
    "stage-7": "데이터 저장"
  };
  const programNames = {
    all: "선택 분야 전체 보기",
    canva: "Canva AI",
    genially: "Genially",
    sites: "Google Sites",
    tally: "Tally",
    appsheet: "AppSheet",
    netlify: "Netlify",
    github: "GitHub Pages",
    cloudflare: "Cloudflare Pages",
    vercel: "Vercel",
    supabase: "Supabase",
    firebase: "Firebase",
    compare: "백엔드 역할 도구 비교"
  };
  const programDescriptions = {
    canva: "Canva AI는 안내 페이지, 짧은 상호작용 활동, 시각 자료 제작을 빠르게 시작할 때 좋습니다. 공지·과제는 Classroom/LMS, 응답 수집은 Forms/Tally가 더 나은지 먼저 봅니다.",
    genially: "Genially는 지도, 이미지, 퀴즈, 방탈출형 흐름처럼 학생이 눌러보며 배우는 활동에 적합합니다. 정형 퀴즈는 Kahoot/Quizizz/Wordwall이 더 빠를 수 있습니다.",
    sites: "Google Sites는 Google 자료를 한곳에 모으는 수업 허브에 강합니다. 학급 내부 공지·과제·성적 관리는 Classroom/LMS가 더 적합할 수 있습니다.",
    tally: "Tally는 문서처럼 자연스럽게 폼을 만들고 조건부 질문을 구성할 때 편합니다. 학교 Google 계정 중심 운영이 중요하면 Google Forms와 비교하세요.",
    appsheet: "AppSheet는 Google Sheets를 제출 현황, 모둠 체크, 답사 준비물 관리 같은 앱으로 바꿀 때 유용합니다. 단순 확인은 Sheets 필터만으로도 충분할 수 있습니다.",
    netlify: "Netlify는 AI가 만든 HTML 폴더를 빠르게 웹주소로 바꾸는 첫 배포 도구입니다. 자체 게시되는 Canva나 Google Sites를 쓰면 이 단계는 건너뛰어도 됩니다.",
    github: "GitHub Pages는 저장소에 파일을 보관하며 매년 수정해 쓰는 자료에 적합합니다. 한 번만 공유할 자료는 Netlify나 자체 게시 도구가 더 쉬울 수 있습니다.",
    cloudflare: "Cloudflare Pages는 GitHub 저장소와 연결해 자동 배포와 장기 운영을 관리할 때 좋습니다. GitHub가 낯설다면 Netlify나 Google Sites로 먼저 시작하세요.",
    vercel: "Vercel은 React나 Next.js처럼 여러 화면과 서버 처리가 섞인 프로젝트형 웹앱에 적합합니다. HTML 한 장짜리 안내 페이지에는 과할 수 있습니다.",
    supabase: "Supabase는 표처럼 저장하고 조회하는 웹앱 데이터베이스에 적합합니다. Forms/Tally/AppSheet로 충분한지 먼저 보고 보안 규칙을 점검합니다.",
    firebase: "Firebase는 로그인, 실시간 동기화, 파일 저장이 필요한 웹앱에 강합니다. 단순 설문이나 안내 페이지에는 과하고 공개 범위 확인이 필수입니다.",
    compare: "백엔드 역할 도구 비교는 Forms, Tally, Apps Script, AppSheet, Supabase, Firebase의 가능 범위와 한계를 함께 볼 때 사용합니다."
  };

  function getCardStages(card) {
    return (card.dataset.programStages || "").split(/\s+/).filter(Boolean);
  }

  function getProgramsForStage(stage) {
    return new Set(
      cards
        .filter((card) => getCardStages(card).includes(stage))
        .map((card) => card.dataset.programCard)
    );
  }

  function renderGuide(stage, program = "all") {
    const availablePrograms = getProgramsForStage(stage);
    const selectedProgram = program !== "all" && availablePrograms.has(program) ? program : "all";

    activeStage = stage;

    stageButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.stageFilter === stage));
    });

    programButtons.forEach((button) => {
      const programFilter = button.dataset.programFilter;
      const isVisible = programFilter === "all" || availablePrograms.has(programFilter);

      button.hidden = !isVisible;
      button.setAttribute("aria-pressed", String(isVisible && programFilter === selectedProgram));
    });

    cards.forEach((card) => {
      const isInStage = getCardStages(card).includes(stage);
      const isSelectedProgram = selectedProgram === "all" || card.dataset.programCard === selectedProgram;

      card.hidden = !(isInStage && isSelectedProgram);
    });

    if (note) {
      const stageName = stageNames[stage] || "선택한 분야";
      note.textContent = selectedProgram === "all"
        ? `${notes[stage] || ""} 아래 내용이 많게 느껴지면 2차 선택에서 필요한 프로그램 하나만 골라 보세요.`
        : `${programDescriptions[selectedProgram] || "선택한 프로그램 설명을 보고 있습니다."} 같은 묶음의 다른 도구를 보려면 2차 선택에서 다시 고르세요.`;
    }

    if (stageTitle) {
      const stageName = stageNames[stage] || "선택한 분야";
      stageTitle.textContent = selectedProgram === "all"
        ? `${stageName} 분야 전체 보기`
        : `${stageName} · ${programNames[selectedProgram] || "선택한 프로그램"}`;
    }

    if (stageKind) {
      stageKind.textContent = stageKinds[stage] || "선택";
    }

    if (summaryStates.length) {
      const stageName = stageNames[stage] || "선택한 분야";
      summaryStates.forEach((summaryState) => {
        summaryState.textContent = `현재 선택: ${stageName} · ${programNames[selectedProgram] || "선택한 프로그램"}`;
      });
    }
  }

  stageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      renderGuide(button.dataset.stageFilter, "all");
    });
  });

  programButtons.forEach((button) => {
    button.addEventListener("click", () => {
      renderGuide(activeStage || stageButtons[0]?.dataset.stageFilter, button.dataset.programFilter);
    });
  });

  const activeButton = stageButtons.find((button) => button.getAttribute("aria-pressed") === "true") || stageButtons[0];

  if (activeButton) {
    renderGuide(activeButton.dataset.stageFilter, "all");
  }

}

function setupMobileCollapses() {
  const collapses = Array.from(document.querySelectorAll("[data-mobile-collapse]"));

  if (!collapses.length) {
    return;
  }

  const mediaQuery = window.matchMedia("(max-width: 680px)");

  function applyCollapseState() {
    collapses.forEach((collapse) => {
      collapse.open = !mediaQuery.matches;
    });
  }

  applyCollapseState();

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", applyCollapseState);
  } else {
    mediaQuery.addListener(applyCollapseState);
  }
}

function setupProgramCardToggles() {
  const cards = document.querySelectorAll(".program-card");

  cards.forEach((card) => {
    if (card.dataset.togglesReady === "true") {
      return;
    }

    const headings = Array.from(card.children).filter((child) => child.tagName === "H4");

    if (!headings.length) {
      return;
    }

    const intro = document.createElement("div");
    intro.className = "toggle-intro";
    intro.textContent = "처음이라면 모든 항목을 한 번에 열지 말고, 화면 찾기 → 실제 진행 순서 → 막혔을 때 질문 순서로 필요한 부분만 펼쳐 보세요.";
    headings[0].before(intro);

    headings.forEach((heading) => {
      const details = document.createElement("details");
      details.className = "guide-toggle";

      const summary = document.createElement("summary");
      summary.textContent = heading.textContent.trim();

      const body = document.createElement("div");
      body.className = "guide-toggle-body";

      let next = heading.nextSibling;
      heading.replaceWith(details);
      details.append(summary, body);

      while (next && !(next.nodeType === 1 && next.matches("h4"))) {
        const current = next;
        next = next.nextSibling;
        body.appendChild(current);
      }
    });

    card.dataset.togglesReady = "true";
  });
}

function setupProgramOverviewToggles() {
  const cards = document.querySelectorAll(".program-card");
  const mediaQuery = window.matchMedia("(max-width: 760px)");

  cards.forEach((card) => {
    if (card.dataset.overviewReady === "true") {
      return;
    }

    const quickStart = card.querySelector(":scope > .program-quick-start");
    const pinnedWarning = card.querySelector(":scope > .program-risk-pinned");
    const title = card.querySelector(":scope > .program-title");
    const anchor = pinnedWarning || quickStart || title;

    if (!anchor) {
      return;
    }

    const nodes = [];
    let next = anchor.nextSibling;

    while (next && !(next.nodeType === 1 && next.matches("h4, .guide-toggle"))) {
      const current = next;
      next = next.nextSibling;
      nodes.push(current);
    }

    const hasVisibleContent = nodes.some((node) => {
      if (node.nodeType === 1) {
        return true;
      }
      return node.textContent.trim().length > 0;
    });

    if (!hasVisibleContent) {
      card.dataset.overviewReady = "true";
      return;
    }

    const details = document.createElement("details");
    details.className = "guide-toggle overview-toggle";
    details.open = !mediaQuery.matches;

    const summary = document.createElement("summary");
    summary.textContent = "준비물·대체 앱·주의점 먼저 확인";

    const body = document.createElement("div");
    body.className = "guide-toggle-body";

    anchor.after(details);
    details.append(summary, body);
    nodes.forEach((node) => body.appendChild(node));

    card.dataset.overviewReady = "true";
  });
}

function setupProgramPinnedWarnings() {
  const cards = document.querySelectorAll(".program-card");
  const warnings = {
    github: {
      label: "Public 저장소 주의",
      text: "GitHub Pages를 쓰려고 Public 저장소를 만들면 온라인 공개 자료함이 됩니다. 학생 명단, 성적, 상담 내용, 비공개 Drive 링크, API 비밀 키는 올리지 않습니다."
    },
    cloudflare: {
      label: "처음이면 건너뛰기 가능",
      text: "Cloudflare Pages는 GitHub 자동 배포와 장기 운영에 좋지만 첫 배포 필수 도구는 아닙니다. GitHub와 빌드 설정이 낯설다면 Netlify나 Google Sites부터 시작하세요."
    },
    vercel: {
      label: "프로젝트형 웹앱용",
      text: "Vercel은 React나 Next.js 프로젝트에 적합합니다. HTML 한 장짜리 안내 페이지에는 과할 수 있고, 비밀 키는 화면 코드에 넣으면 안 됩니다."
    },
    supabase: {
      label: "보안 규칙 먼저",
      text: "Supabase는 직접 만든 웹앱이 데이터를 저장하고 다시 불러와야 할 때 검토합니다. RLS 없이 공개하면 다른 학생 응답이 보이거나 수정될 수 있습니다."
    },
    firebase: {
      label: "테스트 모드 공개 금지",
      text: "Firebase는 로그인, 실시간 동기화, 파일 업로드가 꼭 필요할 때 선택합니다. 테스트 모드나 느슨한 보안 규칙을 그대로 공개하지 않습니다."
    }
  };

  cards.forEach((card) => {
    if (card.dataset.pinnedWarningReady === "true") {
      return;
    }

    const info = warnings[card.dataset.programCard];
    const quickStart = card.querySelector(":scope > .program-quick-start");

    if (!info || !quickStart) {
      card.dataset.pinnedWarningReady = "true";
      return;
    }

    const warning = document.createElement("div");
    warning.className = "program-risk-pinned";
    warning.innerHTML = `
      <span class="badge rose">${info.label}</span>
      <p>${info.text}</p>
    `;

    quickStart.after(warning);
    card.dataset.pinnedWarningReady = "true";
  });
}

function setupProgramQuickStarts() {
  const cards = document.querySelectorAll(".program-card");
  const levels = {
    canva: {
      label: "처음 시작 추천",
      tone: "",
      text: "코딩 없이 안내 화면, 짧은 활동, 시각 자료를 빠르게 만들고 싶을 때 먼저 볼 도구입니다."
    },
    sites: {
      label: "처음 시작 추천",
      tone: "",
      text: "Google 자료와 링크를 한곳에 모으는 수업 허브가 필요할 때 먼저 볼 도구입니다."
    },
    tally: {
      label: "처음 시작 추천",
      tone: "",
      text: "신청, 피드백, 익명 의견처럼 간단한 제출을 받을 때 먼저 볼 수 있습니다."
    },
    netlify: {
      label: "처음 시작 추천",
      tone: "",
      text: "AI가 만든 HTML 폴더를 가장 빨리 웹주소로 바꾸고 싶을 때 첫 배포용으로 좋습니다."
    },
    genially: {
      label: "상황 맞으면 추천",
      tone: "gold",
      text: "학생이 이미지, 지도, 단서, 팝업을 눌러보는 활동이 필요할 때 선택합니다."
    },
    appsheet: {
      label: "상황 맞으면 추천",
      tone: "gold",
      text: "Google Sheets로 제출 현황이나 모둠 체크를 계속 관리해야 할 때 검토합니다."
    },
    github: {
      label: "상황 맞으면 추천",
      tone: "gold",
      text: "수업 사이트를 매년 수정하고 파일 기록을 남기며 오래 관리할 때 적합합니다."
    },
    cloudflare: {
      label: "고급 단계",
      tone: "rose",
      text: "GitHub 자동 배포와 장기 운영이 필요할 때 검토합니다. 첫 배포 도구는 아닙니다."
    },
    vercel: {
      label: "고급 단계",
      tone: "rose",
      text: "React나 Next.js처럼 프로젝트형 웹앱을 배포할 때 검토합니다."
    },
    supabase: {
      label: "고급 단계",
      tone: "rose",
      text: "직접 만든 웹앱이 데이터를 저장하고 다시 불러와야 할 때만 검토합니다."
    },
    firebase: {
      label: "고급 단계",
      tone: "rose",
      text: "로그인, 실시간 동기화, 파일 저장이 필요한 기능 많은 웹앱에서 검토합니다."
    },
    compare: {
      label: "비교용",
      tone: "blue",
      text: "응답 수집과 백엔드 역할 도구의 차이를 비교할 때 보는 카드입니다."
    }
  };
  const guide = {
    canva: {
      summary: "말로 안내 페이지, 짧은 퀴즈, 카드 활동, 시각 자료, Canva Sheets 기반 표와 차트를 빠르게 만들어보는 첫 제작 도구입니다.",
      first: "학생 기기에서 페이지가 열리고, 버튼과 활동이 작동하며, 필요한 표나 차트가 Canva 안에서 확인되면 성공입니다.",
      caution: "Canva Sheets는 가벼운 데이터 저장과 시각화에 좋지만, 학생별 누적 기록과 로그인, 성적 관리가 필요하면 Forms, AppSheet, Supabase 같은 저장 도구를 따로 검토합니다.",
      ask: "Canva AI에서 만들 결과를 수업 목표, 대상 학년, 학생 행동, Canva Sheets에 저장할 표 항목, 공개 범위까지 포함해 한 문장으로 정리해 달라고 물어보세요."
    },
    genially: {
      summary: "학생이 지도, 이미지, 버튼, 팝업을 눌러보며 배우는 조작형 활동에 강합니다.",
      first: "모든 버튼, 팝업, 다음 화면 이동, 퀴즈 해설이 학생 기기에서 작동하면 성공입니다.",
      caution: "점수 저장이나 제출 관리는 Genially 안에서 해결하려 하기보다 Forms나 Tally로 연결하는 편이 안전합니다.",
      ask: "내 수업 자료에서 학생이 눌러볼 지점 5개와 각 지점의 팝업 설명을 만들어 달라고 물어보세요."
    },
    sites: {
      summary: "Google 자료, 설문, 슬라이드, 문서를 한 주소에 모으는 수업 허브에 가장 안정적인 도구입니다.",
      first: "교사 계정이 아니라 학생 계정에서도 사이트와 삽입 자료가 모두 열리면 성공입니다.",
      caution: "사이트 공개와 Drive 파일 공개는 별도입니다. 사이트만 열리고 파일이 잠겨 있으면 학생은 자료를 볼 수 없습니다.",
      ask: "내 자료 목록을 주고 Google Sites 메뉴 구조와 Drive 권한 점검 순서를 만들어 달라고 물어보세요."
    },
    tally: {
      summary: "신청, 피드백, 익명 의견처럼 학생이 한 번 제출하고 교사가 확인하는 폼에 적합합니다.",
      first: "학생이 모바일에서 제출하고, 교사가 응답 위치와 공개 범위를 설명할 수 있으면 성공입니다.",
      caution: "학교 계정 기반 관리가 중요하면 Google Forms와 비교하고, 상태별 관리는 AppSheet를 검토합니다.",
      ask: "받을 정보와 받지 않을 정보를 나누고, 개인정보 최소화 기준으로 문항을 줄여 달라고 물어보세요."
    },
    appsheet: {
      summary: "Google Sheets 표를 입력·조회·체크용 관리 앱으로 바꾸는 중간 단계 도구입니다.",
      first: "샘플 시트가 앱 화면으로 바뀌고, 학생 입력 항목과 교사용 확인 항목이 분리되면 성공입니다.",
      caution: "공개용 디자인 웹페이지보다 내부 관리 앱에 가깝고, 시트 공유 권한과 앱 권한을 함께 봐야 합니다.",
      ask: "내 시트 열 이름을 붙여넣고 학생 입력용, 교사용 확인용, 권한 주의 열을 나눠 달라고 물어보세요."
    },
    netlify: {
      summary: "AI가 만든 `index.html` 폴더를 가장 빨리 웹주소로 바꾸는 첫 배포 도구입니다.",
      first: "폴더를 올린 뒤 주소가 생기고, 이미지와 버튼까지 실제 주소에서 보이면 성공입니다.",
      caution: "`index.html`만 올리면 이미지나 CSS가 깨질 수 있습니다. 처음에는 폴더 전체를 올리세요.",
      ask: "내 폴더 안 파일 목록을 보여주고 Netlify에 어떤 폴더를 올려야 하는지 점검해 달라고 물어보세요."
    },
    github: {
      summary: "수업 사이트 파일을 온라인 저장소에 보관하고, Pages 기능으로 공개하는 장기 관리 방식입니다.",
      first: "저장소 첫 화면에 `index.html`이 보이고, Pages 주소에서 페이지가 열리면 성공입니다.",
      caution: "Public 저장소에는 학생 이름, 학번, 얼굴 사진, 학교 내부 자료를 올리지 않습니다.",
      ask: "저장소는 온라인 폴더, commit은 저장 도장, Pages는 공개 다리라는 비유로 다음 단계를 설명해 달라고 물어보세요."
    },
    cloudflare: {
      summary: "GitHub 저장소와 연결해 수정 사항을 자동 배포하는 장기 운영용 선택지입니다.",
      first: "GitHub에 수정한 파일을 올렸을 때 Cloudflare Pages가 새 버전을 자동 배포하면 성공입니다.",
      caution: "GitHub 저장소가 아직 낯설면 먼저 Netlify나 GitHub Pages로 첫 배포를 경험하는 편이 좋습니다.",
      ask: "GitHub 저장소와 `index.html` 위치를 알려주고 build command와 output directory를 어떻게 넣을지 물어보세요."
    },
    vercel: {
      summary: "React나 Next.js처럼 여러 화면과 서버 기능이 섞인 프로젝트형 웹앱 배포에 적합합니다.",
      first: "`package.json`이 있는 프로젝트가 GitHub와 연결되고, 배포 주소에서 앱이 작동하면 성공입니다.",
      caution: "HTML 한 장짜리 안내 페이지에는 과할 수 있습니다. 먼저 Netlify나 GitHub Pages와 비교하세요.",
      ask: "내 프로젝트가 HTML 한 장인지 React/Next.js인지 판단하고, Vercel이 필요한 상황인지 비교해 달라고 물어보세요."
    },
    supabase: {
      summary: "학생 응답, 제출 목록, 지도 데이터처럼 행과 열로 저장할 데이터에 강한 백엔드 도구입니다.",
      first: "익명 테스트 데이터가 저장되고, 다른 학생 응답이 노출되지 않도록 보안 규칙을 설명할 수 있으면 성공입니다.",
      caution: "브라우저 코드에 service role key를 넣지 않습니다. 실제 학생 개인정보는 학교 정책 확인 뒤 저장합니다.",
      ask: "저장할 항목을 붙여넣고 개인정보 최소화, 테이블 구조, RLS 정책, 테스트 순서를 설계해 달라고 물어보세요."
    },
    firebase: {
      summary: "로그인, 실시간 동기화, 파일 저장이 필요한 기능 많은 웹앱에 강한 Google 기반 백엔드입니다.",
      first: "테스트 모드가 꺼져 있고, 로그인 여부에 따라 읽기와 쓰기 권한이 다르게 작동하면 성공입니다.",
      caution: "단순 설문이나 안내 페이지에는 과합니다. Forms, AppSheet, Supabase로 충분한지 먼저 비교하세요.",
      ask: "Firebase가 꼭 필요한 기능인지, 테스트 모드 공개가 왜 위험한지, 저장할 최소 데이터가 무엇인지 물어보세요."
    },
    compare: {
      summary: "응답 수집, 시트 관리, 가벼운 자동화, 본격 데이터베이스의 차이를 한 번에 비교하는 영역입니다.",
      first: "내 수업에서 저장해야 하는 정보와 공개하면 안 되는 정보를 나눌 수 있으면 성공입니다.",
      caution: "도구 이름보다 개인정보 위험도와 수업 목적을 먼저 봐야 합니다.",
      ask: "내가 저장하려는 데이터와 수업 목적을 기준으로 Forms, AppSheet, Supabase, Firebase 중 가장 단순한 도구를 골라 달라고 물어보세요."
    }
  };

  cards.forEach((card) => {
    if (card.dataset.quickStartReady === "true") {
      return;
    }

    const info = guide[card.dataset.programCard];
    const level = levels[card.dataset.programCard];
    const title = card.querySelector(".program-title");

    if (!info || !title) {
      return;
    }

    const quickStart = document.createElement("div");
    quickStart.className = "program-quick-start";
    quickStart.innerHTML = `
      <div class="quick-start-head">
        <span class="badge">3분 요약</span>
        ${level ? `<span class="badge ${level.tone}">${level.label}</span>` : ""}
        <strong>먼저 이 네 가지만 보고 판단하세요</strong>
      </div>
      ${level ? `<p class="program-level-text">${level.text}</p>` : ""}
      <div class="quick-start-grid">
        <div class="quick-start-box">
          <strong>무엇에 좋은가요?</strong>
          <p>${info.summary}</p>
        </div>
        <div class="quick-start-box">
          <strong>첫 성공 기준</strong>
          <p>${info.first}</p>
        </div>
        <div class="quick-start-box">
          <strong>조심할 점</strong>
          <p>${info.caution}</p>
        </div>
        <div class="quick-start-box">
          <strong>AI에게 먼저 물어볼 말</strong>
          <p>${info.ask}</p>
        </div>
      </div>
    `;

    title.after(quickStart);
    card.dataset.quickStartReady = "true";
  });
}

function setupInitialProgramStageFromHash() {
  const hash = window.location.hash.replace("#", "");
  const button = document.querySelector(`[data-stage-filter='${hash}']`) || document.getElementById(hash);

  if (!button || !button.classList.contains("program-filter-button")) {
    return;
  }

  if (button.dataset.programFilter && button.dataset.programFilter !== "all") {
    const card = document.querySelector(`[data-program-card='${button.dataset.programFilter}']`);
    const firstStage = (card?.dataset.programStages || "").split(/\s+/).filter(Boolean)[0];
    const stageButton = firstStage ? document.querySelector(`[data-stage-filter='${firstStage}']`) : null;

    if (stageButton) {
      stageButton.click();
    }
  }

  button.click();

  const target = document.querySelector("#program-detail");

  if (target) {
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ block: "start" });
    });
  }
}

function setupThemeToggle() {
  const root = document.documentElement;
  const storageKey = "teacher-web-guide-theme";
  const savedTheme = localStorage.getItem(storageKey);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  root.dataset.theme = initialTheme;

  const button = document.createElement("button");
  button.className = "theme-toggle";
  button.type = "button";

  function updateButton() {
    const isDark = root.dataset.theme === "dark";
    button.textContent = isDark ? "라이트 모드" : "다크 모드";
    button.setAttribute("aria-label", isDark ? "라이트 모드로 전환" : "다크 모드로 전환");
  }

  button.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(storageKey, root.dataset.theme);
    updateButton();
  });

  updateButton();
  document.body.append(button);
}

document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  setupTabs();
  setupTocTabLinks();
  setupProgramFilters();
  setupProgramStageGuide();
  setupMobileCollapses();
  setupProgramQuickStarts();
  setupProgramPinnedWarnings();
  setupProgramOverviewToggles();
  setupProgramCardToggles();
  setupInitialProgramStageFromHash();
  window.addEventListener("hashchange", setupInitialProgramStageFromHash);
});
