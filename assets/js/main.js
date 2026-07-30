(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector("#header");
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");
  const scrollTop = document.querySelector(".scroll-top");
  const preloader = document.querySelector("#preloader");
  const navLinks = Array.from(document.querySelectorAll(".navmenu a"));
  const newsDateFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  let simulationPreviewInitialized = false;
  let simulationPreviewTimer = null;
  let newsFeedRequest = null;
  let newsFeedData = null;

  function hasStickyHeader() {
    return !!(
      header &&
      (header.classList.contains("scroll-up-sticky") ||
        header.classList.contains("sticky-top") ||
        header.classList.contains("fixed-top"))
    );
  }

  function toggleScrolled() {
    if (!hasStickyHeader()) {
      return;
    }

    body.classList.toggle("scrolled", window.scrollY > 100);
  }

  function setMobileNavState(isOpen) {
    if (!mobileNavToggleBtn) {
      return;
    }

    body.classList.toggle("mobile-nav-active", isOpen);
    mobileNavToggleBtn.classList.toggle("bi-list", !isOpen);
    mobileNavToggleBtn.classList.toggle("bi-x", isOpen);
    mobileNavToggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    mobileNavToggleBtn.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  }

  function toggleMobileNav() {
    if (!mobileNavToggleBtn) {
      return;
    }

    setMobileNavState(!body.classList.contains("mobile-nav-active"));
  }

  function syncMobileNav() {
    if (!mobileNavToggleBtn) {
      return;
    }

    if (window.innerWidth >= 1200) {
      setMobileNavState(false);
      return;
    }

    setMobileNavState(body.classList.contains("mobile-nav-active"));
  }

  function toggleScrollTop() {
    if (!scrollTop) {
      return;
    }

    scrollTop.classList.toggle("active", window.scrollY > 100);
  }

  function initAOS() {
    if (!window.AOS) {
      return;
    }

    window.AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }

  function restoreHashScroll() {
    if (!window.location.hash) {
      return;
    }

    const section = document.querySelector(window.location.hash);

    if (!section) {
      return;
    }

    const scrollMarginTop = parseInt(getComputedStyle(section).scrollMarginTop, 10) || 0;

    window.scrollTo({
      top: section.offsetTop - scrollMarginTop,
      behavior: "smooth",
    });
  }

  function navmenuScrollspy() {
    const position = window.scrollY + 200;

    navLinks.forEach((link) => {
      if (!link.hash) {
        return;
      }

      const section = document.querySelector(link.hash);

      if (!section) {
        link.classList.remove("active");
        return;
      }

      const isActive =
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight;

      link.classList.toggle("active", isActive);
    });
  }

  function initSimulationPreview() {
    if (simulationPreviewInitialized && simulationPreviewTimer !== null) {
      return;
    }

    const map = document.querySelector("#lt-sim-map");
    const clock = document.querySelector("#lt-sim-clock");
    const area = document.querySelector("#lt-sim-area");
    const mapTitle = document.querySelector("#lt-sim-map-title");
    const region = document.querySelector("#lt-sim-region");
    const regionLabel = document.querySelector("#lt-sim-region-label");
    const link = document.querySelector("#lt-sim-link");
    const compute = document.querySelector("#lt-sim-compute");
    const satellitesRoot = document.querySelector("#lt-sim-satellites");
    const workflowName = document.querySelector("#lt-sim-workflow");
    const description = document.querySelector("#lt-sim-description");
    const template = document.querySelector("#lt-sim-template");
    const cadence = document.querySelector("#lt-sim-cadence");
    const output = document.querySelector("#lt-sim-output");
    const tracker = document.querySelector("#lt-sim-tracker");
    const chips = document.querySelector("#lt-sim-chips");

    if (
      !map ||
      !clock ||
      !area ||
      !mapTitle ||
      !region ||
      !regionLabel ||
      !link ||
      !compute ||
      !satellitesRoot ||
      !workflowName ||
      !description ||
      !template ||
      !cadence ||
      !output ||
      !tracker ||
      !chips
    ) {
      return;
    }

    satellitesRoot.replaceChildren();
    simulationPreviewInitialized = true;

    const satellites = [
      { id: "leo-01", name: "LEO-01", periodMinutes: 95, inclinationDeg: 55, phaseOffsetDeg: 0, trackOffsetDeg: -24 },
      { id: "leo-02", name: "LEO-02", periodMinutes: 96, inclinationDeg: 58, phaseOffsetDeg: 24, trackOffsetDeg: -8 },
      { id: "leo-03", name: "LEO-03", periodMinutes: 97, inclinationDeg: 60, phaseOffsetDeg: 48, trackOffsetDeg: 12 },
      { id: "leo-04", name: "LEO-04", periodMinutes: 98, inclinationDeg: 62, phaseOffsetDeg: 72, trackOffsetDeg: 28 },
      { id: "leo-05", name: "LEO-05", periodMinutes: 99, inclinationDeg: 64, phaseOffsetDeg: 96, trackOffsetDeg: 44 },
      { id: "leo-06", name: "LEO-06", periodMinutes: 100, inclinationDeg: 66, phaseOffsetDeg: 120, trackOffsetDeg: 60 },
      { id: "leo-07", name: "LEO-07", periodMinutes: 101, inclinationDeg: 68, phaseOffsetDeg: 144, trackOffsetDeg: 76 },
      { id: "leo-08", name: "LEO-08", periodMinutes: 102, inclinationDeg: 70, phaseOffsetDeg: 168, trackOffsetDeg: 92 },
      { id: "leo-09", name: "LEO-09", periodMinutes: 103, inclinationDeg: 72, phaseOffsetDeg: 192, trackOffsetDeg: 108 },
      { id: "leo-10", name: "LEO-10", periodMinutes: 104, inclinationDeg: 74, phaseOffsetDeg: 216, trackOffsetDeg: 124 },
    ];

    const workflows = [
      {
        id: "wf-wildfire-iberia",
        name: "Iberia wildfire watch",
        template: "wildfire-monitoring",
        cadence: "10 min sweep",
        output: "alert-and-mask",
        areaLabel: "Iberian Peninsula",
        description: "Mock wildfire workflow scanning Iberia for thermal anomalies and smoke indicators.",
        region: { north: 44.5, south: 35.5, west: -10.5, east: 4.5 },
      },
      {
        id: "wf-mediterranean-maritime",
        name: "Mediterranean vessel risk",
        template: "maritime-monitoring",
        cadence: "15 min sweep",
        output: "report",
        areaLabel: "Central Mediterranean",
        description: "Mock vessel-tracking workflow combining EO revisit windows with route risk scoring.",
        region: { north: 42.5, south: 30.5, west: 5, east: 24 },
      },
      {
        id: "wf-alpine-flood",
        name: "Alpine flood simulation",
        template: "flood-monitoring",
        cadence: "30 min sweep",
        output: "vector-perimeter",
        areaLabel: "Alps catchments",
        description: "Mock flood monitoring workflow focused on alpine basins and rapid surface-water expansion.",
        region: { north: 48.8, south: 44.8, west: 5.2, east: 16.8 },
      },
      {
        id: "wf-sahel-vegetation",
        name: "Sahel vegetation stress",
        template: "vegetation-monitoring",
        cadence: "Daily sweep",
        output: "tiles",
        areaLabel: "Sahel belt",
        description: "Mock vegetation monitoring workflow comparing drought stress signals across the Sahel.",
        region: { north: 19.5, south: 11, west: -17.5, east: 33 },
      },
    ];

    const satelliteLookup = new Map(satellites.map((satellite) => [satellite.id, satellite]));
    const satelliteNodes = new Map();
    const clockFormatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });
    const simulationRate = 180;
    const workflowWindowSeconds = 8;
    const startTime = window.performance.now();

    let lastWorkflowId = "";
    let lastTrackerId = "";
    let lastChipKey = "";

    satellites.forEach((satellite) => {
      const node = document.createElement("span");
      node.className = "lt-simulation-satellite";
      node.textContent = satellite.name.replace("LEO-", "");
      node.title = satellite.name;
      satellitesRoot.appendChild(node);
      satelliteNodes.set(satellite.id, node);
    });

    function renderChips(ids) {
      const fragment = document.createDocumentFragment();

      ids.forEach((id) => {
        const chip = document.createElement("span");
        chip.className = "lt-simulation-chip";
        chip.textContent = id.toUpperCase();
        fragment.appendChild(chip);
      });

      chips.replaceChildren(fragment);
    }

    function formatSimulationClock(nowMs) {
      return `${clockFormatter.format(new Date(nowMs))} UTC`;
    }

    function mapLatLngToPercent(lat, lng) {
      return {
        left: ((normalizeLongitude(lng) + 180) / 360) * 100,
        top: ((90 - lat) / 180) * 100,
      };
    }

    function getRegionBounds(activeRegion) {
      const northWest = mapLatLngToPercent(activeRegion.north, activeRegion.west);
      const southEast = mapLatLngToPercent(activeRegion.south, activeRegion.east);

      return {
        left: northWest.left,
        top: northWest.top,
        width: Math.max(southEast.left - northWest.left, 6),
        height: Math.max(southEast.top - northWest.top, 6),
      };
    }

    function getComputePoint(activeRegion, elapsedRealSeconds, workflowIndex) {
      const latSpan = activeRegion.north - activeRegion.south;
      const lngSpan = activeRegion.east - activeRegion.west;
      const latFactor = 0.18 + (((Math.sin((elapsedRealSeconds * 0.9) + workflowIndex) + 1) / 2) * 0.58);
      const lngFactor = 0.16 + (((Math.cos((elapsedRealSeconds * 0.72) + (workflowIndex * 1.4)) + 1) / 2) * 0.62);

      return mapLatLngToPercent(
        activeRegion.south + (latSpan * latFactor),
        activeRegion.west + (lngSpan * lngFactor),
      );
    }

    function drawLink(origin, target) {
      const mapWidth = map.clientWidth;
      const mapHeight = map.clientHeight;
      const x1 = (origin.left / 100) * mapWidth;
      const y1 = (origin.top / 100) * mapHeight;
      const x2 = (target.left / 100) * mapWidth;
      const y2 = (target.top / 100) * mapHeight;
      const distance = Math.hypot(x2 - x1, y2 - y1);
      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

      link.style.left = `${x1}px`;
      link.style.top = `${y1}px`;
      link.style.width = `${distance}px`;
      link.style.transform = `translateY(-50%) rotate(${angle}deg)`;
    }

    function renderFrame(now = window.performance.now()) {
      if (!document.body.contains(map)) {
        stopSimulationPreview();
        return;
      }

      const elapsedRealSeconds = (now - startTime) / 1000;
      const elapsedSimulationSeconds = elapsedRealSeconds * simulationRate;
      const workflowIndex = Math.floor(elapsedRealSeconds / workflowWindowSeconds) % workflows.length;
      const activeWorkflow = workflows[workflowIndex];
      const closestIds = getClosestSatelliteIds(satellites, activeWorkflow.region, elapsedSimulationSeconds, 3);
      const trackerId = closestIds[0] || "";
      const trackerSatellite = satelliteLookup.get(trackerId) || null;
      const trackerPosition = trackerSatellite ? getSatellitePosition(trackerSatellite, elapsedSimulationSeconds) : null;
      const trackerPoint = trackerPosition ? mapLatLngToPercent(trackerPosition.lat, trackerPosition.lng) : null;
      const regionBounds = getRegionBounds(activeWorkflow.region);
      const computePoint = getComputePoint(activeWorkflow.region, elapsedRealSeconds, workflowIndex);
      const chipKey = closestIds.join(",");

      clock.textContent = formatSimulationClock(Date.now());
      area.textContent = activeWorkflow.areaLabel;
      region.style.left = `${regionBounds.left}%`;
      region.style.top = `${regionBounds.top}%`;
      region.style.width = `${regionBounds.width}%`;
      region.style.height = `${regionBounds.height}%`;
      regionLabel.style.left = `${Math.min(regionBounds.left + 1, 78)}%`;
      regionLabel.style.top = `${Math.max(regionBounds.top - 7, 4)}%`;
      regionLabel.textContent = activeWorkflow.areaLabel;
      compute.style.left = `${computePoint.left}%`;
      compute.style.top = `${computePoint.top}%`;

      satellites.forEach((satellite) => {
        const position = getSatellitePosition(satellite, elapsedSimulationSeconds);
        const point = mapLatLngToPercent(position.lat, position.lng);
        const node = satelliteNodes.get(satellite.id);

        if (!node) {
          return;
        }

        node.style.left = `${point.left}%`;
        node.style.top = `${point.top}%`;
        node.classList.toggle("lt-simulation-satellite--active", closestIds.includes(satellite.id));
        node.classList.toggle("lt-simulation-satellite--tracking", trackerId === satellite.id);
      });

      if (trackerPoint) {
        link.style.opacity = "1";
        drawLink(trackerPoint, computePoint);
      } else {
        link.style.opacity = "0";
      }

      if (activeWorkflow.id !== lastWorkflowId || trackerId !== lastTrackerId || chipKey !== lastChipKey) {
        mapTitle.textContent = activeWorkflow.name;
        workflowName.textContent = activeWorkflow.name;
        description.textContent = activeWorkflow.description;
        template.textContent = activeWorkflow.template;
        cadence.textContent = activeWorkflow.cadence;
        output.textContent = activeWorkflow.output;
        tracker.textContent = trackerSatellite ? trackerSatellite.name : "n/a";
        renderChips(closestIds);
        lastWorkflowId = activeWorkflow.id;
        lastTrackerId = trackerId;
        lastChipKey = chipKey;
      }
    }

    renderFrame();
    simulationPreviewTimer = window.setInterval(() => {
      renderFrame(window.performance.now());
    }, 50);

    function getSatellitePosition(satellite, elapsedSeconds) {
      const orbitProgress = elapsedSeconds / (satellite.periodMinutes * 60);
      const phase = (orbitProgress * Math.PI * 2) + toRadians(satellite.phaseOffsetDeg);
      const drift = (orbitProgress * 360) + satellite.phaseOffsetDeg + satellite.trackOffsetDeg;

      return {
        lat: satellite.inclinationDeg * Math.sin(phase),
        lng: normalizeLongitude(drift),
      };
    }

    function getClosestSatelliteIds(items, activeRegion, elapsedSeconds, count) {
      return items
        .map((satellite) => ({
          id: satellite.id,
          distance: getDistanceToRegion(getSatellitePosition(satellite, elapsedSeconds), activeRegion),
        }))
        .sort((left, right) => left.distance - right.distance)
        .slice(0, Math.max(count, 0))
        .map((satellite) => satellite.id);
    }

    function getDistanceToRegion(position, activeRegion) {
      const nearestLat = clamp(position.lat, Math.min(activeRegion.south, activeRegion.north), Math.max(activeRegion.south, activeRegion.north));
      const nearestLng = clampLongitude(position.lng, Math.min(activeRegion.west, activeRegion.east), Math.max(activeRegion.west, activeRegion.east));
      const latDelta = position.lat - nearestLat;
      const lngDelta = shortestLongitudeDelta(position.lng, nearestLng);

      return Math.sqrt((latDelta * latDelta) + (lngDelta * lngDelta));
    }

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function clampLongitude(value, west, east) {
      const normalizedValue = normalizeLongitude(value);
      const normalizedWest = normalizeLongitude(west);
      const normalizedEast = normalizeLongitude(east);

      if (normalizedWest <= normalizedEast) {
        return clamp(normalizedValue, normalizedWest, normalizedEast);
      }

      const deltaToWest = Math.abs(shortestLongitudeDelta(normalizedValue, normalizedWest));
      const deltaToEast = Math.abs(shortestLongitudeDelta(normalizedValue, normalizedEast));
      return deltaToWest <= deltaToEast ? normalizedWest : normalizedEast;
    }

    function shortestLongitudeDelta(from, to) {
      return normalizeLongitude(to - from);
    }

    function normalizeLongitude(value) {
      return ((((value + 180) % 360) + 360) % 360) - 180;
    }

    function toRadians(value) {
      return (value * Math.PI) / 180;
    }
  }

  function stopSimulationPreview() {
    if (simulationPreviewTimer !== null) {
      window.clearInterval(simulationPreviewTimer);
      simulationPreviewTimer = null;
    }

    simulationPreviewInitialized = false;
  }

  function initNewsFeatures() {
    const homeNewsList = document.querySelector("[data-news-list]");
    const directoryList = document.querySelector("[data-news-page-list]");
    const articleSection = document.querySelector("[data-news-article-page]");

    if (!homeNewsList && !directoryList && !articleSection) {
      return;
    }

    loadNewsFeed()
      .then((items) => {
        if (homeNewsList) {
          renderHomepageNews(homeNewsList, items);
        }

        if (directoryList || articleSection) {
          renderNewsPage(items);
        }
      })
      .catch((error) => {
        console.error(error);

        if (homeNewsList) {
          renderNewsMessage(homeNewsList, "News updates are unavailable right now.");
        }

        if (directoryList) {
          renderNewsMessage(directoryList, "News updates are unavailable right now.");
        }

        if (articleSection) {
          renderMissingArticle();
        }
      });
  }

  function loadNewsFeed() {
    if (newsFeedData) {
      return Promise.resolve(newsFeedData);
    }

    if (newsFeedRequest) {
      return newsFeedRequest;
    }

    newsFeedRequest = window
      .fetch("content/news/news.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load news feed: ${response.status}`);
        }

        return response.json();
      })
      .then((items) => {
        newsFeedData = normalizeNewsItems(items);
        newsFeedRequest = null;
        return newsFeedData;
      })
      .catch((error) => {
        newsFeedRequest = null;
        throw error;
      });

    return newsFeedRequest;
  }

  function normalizeNewsItems(items) {
    if (!Array.isArray(items)) {
      return [];
    }

    return items
      .filter((item) => item && item.title && item.date && item.summary)
      .map((item) => ({
        slug: item.slug || slugify(item.title),
        category: item.category || "Update",
        title: item.title,
        summary: item.summary,
        date: item.date,
        image: item.image || "",
        image_alt: item.image_alt || item.title,
        article_image_fit: item.article_image_fit || "",
        article_image_position: item.article_image_position || "",
        article_image_background: item.article_image_background || "",
        video_embed_url: normalizeOptionalHttpsUrl(item.video_embed_url),
        video_title: normalizeOptionalString(item.video_title) || `${item.title} video`,
        content: normalizeNewsContent(item.content, item.summary),
        external_url: item.external_url || "",
        external_label: item.external_label || "Read more",
      }))
      .sort((left, right) => new Date(right.date) - new Date(left.date));
  }

  function normalizeOptionalString(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function normalizeOptionalHttpsUrl(value) {
    const normalizedValue = normalizeOptionalString(value);

    if (!normalizedValue) {
      return "";
    }

    try {
      const url = new URL(normalizedValue);
      return url.protocol === "https:" ? url.toString() : "";
    } catch (error) {
      return "";
    }
  }

  function normalizeNewsContent(content, fallback) {
    if (Array.isArray(content)) {
      return content.filter((paragraph) => typeof paragraph === "string" && paragraph.trim() !== "");
    }

    if (typeof content === "string" && content.trim() !== "") {
      return [content.trim()];
    }

    return [fallback];
  }

  function renderHomepageNews(newsList, items) {
    if (items.length === 0) {
      renderNewsMessage(newsList, "No news updates published yet.");
      return;
    }

    const fragment = document.createDocumentFragment();

    items.forEach((item, index) => {
      fragment.appendChild(buildNewsCard(item, index, "preview"));
    });

    newsList.replaceChildren(fragment);
    refreshAOS();
  }

  function renderNewsPage(items) {
    const slug = new URLSearchParams(window.location.search).get("slug");
    const directorySection = document.querySelector("[data-news-directory-section]");
    const directoryList = document.querySelector("[data-news-page-list]");
    const articleSection = document.querySelector("[data-news-article-page]");

    if (slug) {
      const article = items.find((item) => item.slug === slug);

      if (!article) {
        renderMissingArticle();
        if (directorySection) {
          directorySection.hidden = true;
        }
        if (articleSection) {
          articleSection.hidden = false;
        }
        return;
      }

      if (directorySection) {
        directorySection.hidden = true;
      }

      if (articleSection) {
        articleSection.hidden = false;
        renderNewsArticle(article);
      }

      document.title = `${article.title} | LeoTrek News`;
      refreshAOS();
      return;
    }

    if (directorySection) {
      directorySection.hidden = false;
    }

    if (articleSection) {
      articleSection.hidden = true;
    }

    document.title = "LeoTrek News";

    if (!directoryList) {
      refreshAOS();
      return;
    }

    if (items.length === 0) {
      renderNewsMessage(directoryList, "No news updates published yet.");
      return;
    }

    const fragment = document.createDocumentFragment();

    items.forEach((item, index) => {
      fragment.appendChild(buildNewsCard(item, index, "directory"));
    });

    directoryList.replaceChildren(fragment);
    refreshAOS();
  }

  function buildNewsCard(item, index, mode) {
    const article = document.createElement("article");
    const mediaLink = item.image ? document.createElement("a") : null;
    const image = item.image ? document.createElement("img") : null;
    const body = document.createElement("div");
    const content = document.createElement("div");
    const meta = document.createElement("div");
    const category = document.createElement("span");
    const time = document.createElement("time");
    const title = document.createElement("h3");
    const titleLink = document.createElement("a");
    const summary = document.createElement("p");
    const actions = document.createElement("div");
    const link = document.createElement("a");
    const icon = document.createElement("i");

    article.className = `lt-news-card lt-news-card--${mode}`;
    article.setAttribute("data-aos", "fade-up");
    article.setAttribute("data-aos-delay", `${100 + (index * 50)}`);
    body.className = "lt-news-card-body";
    content.className = "lt-news-card-content";

    if (mediaLink && image) {
      mediaLink.className = "lt-news-card-media";
      mediaLink.href = getNewsArticleHref(item);

      image.src = item.image;
      image.alt = item.image_alt;
      image.loading = "lazy";

      mediaLink.appendChild(image);

      if (mode === "directory") {
        body.appendChild(mediaLink);
      } else {
        article.appendChild(mediaLink);
      }
    }

    meta.className = "lt-news-meta";
    category.className = "lt-news-category";
    category.textContent = item.category;
    time.className = "lt-news-date";
    time.dateTime = item.date;
    time.textContent = formatNewsDate(item.date);

    titleLink.className = "lt-news-card-title-link";
    titleLink.href = getNewsArticleHref(item);
    titleLink.textContent = item.title;

    title.appendChild(titleLink);
    summary.textContent = item.summary;
    meta.append(category, time);
    content.append(meta, title, summary);

    actions.className = "lt-news-actions";
    link.className = "lt-news-link";
    link.href = getNewsArticleHref(item);
    link.textContent = "Open article";

    icon.className = "bi bi-arrow-right";
    icon.setAttribute("aria-hidden", "true");
    link.appendChild(document.createTextNode(" "));
    link.appendChild(icon);
    actions.appendChild(link);

    if (item.external_url) {
      const externalLink = document.createElement("a");

      externalLink.className = "lt-news-link lt-news-link-secondary";
      externalLink.href = item.external_url;
      externalLink.target = "_blank";
      externalLink.rel = "noopener";
      externalLink.textContent = item.external_label;
      actions.appendChild(externalLink);
    }

    content.appendChild(actions);

    if (mode === "directory") {
      body.appendChild(content);
    } else {
      body.append(meta, title, summary, actions);
    }

    article.appendChild(body);
    return article;
  }

  function renderNewsArticle(item) {
    const category = document.querySelector("[data-news-article-category]");
    const time = document.querySelector("[data-news-article-date]");
    const title = document.querySelector("[data-news-article-title]");
    const summary = document.querySelector("[data-news-article-summary]");
    const imageWrap = document.querySelector("[data-news-article-image-wrap]");
    const image = document.querySelector("[data-news-article-image]");
    const videoWrap = document.querySelector("[data-news-article-video-wrap]");
    const video = document.querySelector("[data-news-article-video]");
    const content = document.querySelector("[data-news-article-content]");
    const external = document.querySelector("[data-news-article-external]");

    if (!category || !time || !title || !summary || !content) {
      return;
    }

    category.textContent = item.category;
    time.dateTime = item.date;
    time.textContent = formatNewsDate(item.date);
    title.textContent = item.title;
    summary.textContent = item.summary;

    if (imageWrap && image) {
      if (item.image) {
        image.onload = null;
        image.src = item.image;
        image.alt = item.image_alt;
        image.loading = "eager";
        applyArticleImagePresentation(imageWrap, image, item);
        imageWrap.hidden = false;
      } else {
        image.removeAttribute("src");
        image.alt = "";
        image.style.objectFit = "";
        image.style.objectPosition = "";
        imageWrap.style.background = "";
        imageWrap.hidden = true;
      }
    }

    if (videoWrap && video) {
      if (item.video_embed_url) {
        video.src = item.video_embed_url;
        video.title = item.video_title;
        videoWrap.hidden = false;
      } else {
        video.removeAttribute("src");
        video.title = "";
        videoWrap.hidden = true;
      }
    }

    if (external) {
      if (item.external_url) {
        external.href = item.external_url;
        external.textContent = item.external_label;
        external.hidden = false;
      } else {
        external.hidden = true;
      }
    }

    const fragment = document.createDocumentFragment();

    item.content.forEach((paragraphText) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = paragraphText;
      fragment.appendChild(paragraph);
    });

    content.replaceChildren(fragment);
  }

  function applyArticleImagePresentation(imageWrap, image, item) {
    const apply = () => {
      const presentation = resolveArticleImagePresentation(image, item);

      image.style.objectFit = presentation.fit;
      image.style.objectPosition = presentation.position;
      imageWrap.style.background = presentation.background;
    };

    if (image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) {
      apply();
      return;
    }

    image.onload = apply;
  }

  function resolveArticleImagePresentation(image, item) {
    if (item.article_image_fit || item.article_image_position || item.article_image_background) {
      return {
        fit: item.article_image_fit || "cover",
        position: item.article_image_position || "center center",
        background: item.article_image_background || "",
      };
    }

    if (!image.naturalWidth || !image.naturalHeight) {
      return {
        fit: "cover",
        position: "center center",
        background: "",
      };
    }

    const frameRatio = 16 / 9;
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const visibleFraction = imageRatio > frameRatio
      ? frameRatio / imageRatio
      : imageRatio / frameRatio;

    if (visibleFraction < 0.82) {
      return {
        fit: "contain",
        position: "center center",
        background: "#08141b",
      };
    }

    return {
      fit: "cover",
      position: "center center",
      background: "",
    };
  }

  function renderMissingArticle() {
    const category = document.querySelector("[data-news-article-category]");
    const time = document.querySelector("[data-news-article-date]");
    const title = document.querySelector("[data-news-article-title]");
    const summary = document.querySelector("[data-news-article-summary]");
    const imageWrap = document.querySelector("[data-news-article-image-wrap]");
    const videoWrap = document.querySelector("[data-news-article-video-wrap]");
    const video = document.querySelector("[data-news-article-video]");
    const content = document.querySelector("[data-news-article-content]");
    const external = document.querySelector("[data-news-article-external]");
    const articleSection = document.querySelector("[data-news-article-page]");

    if (articleSection) {
      articleSection.hidden = false;
    }

    if (category) {
      category.textContent = "News";
    }

    if (time) {
      time.removeAttribute("datetime");
      time.textContent = "";
    }

    if (title) {
      title.textContent = "Article not found";
    }

    if (summary) {
      summary.textContent = "The requested news item does not exist or has been removed.";
    }

    if (imageWrap) {
      imageWrap.hidden = true;
    }

    if (videoWrap && video) {
      video.removeAttribute("src");
      video.title = "";
      videoWrap.hidden = true;
    }

    if (content) {
      const paragraph = document.createElement("p");
      paragraph.textContent = "Return to the news overview to browse the available updates.";
      content.replaceChildren(paragraph);
    }

    if (external) {
      external.hidden = true;
    }

    document.title = "LeoTrek News";
  }

  function renderNewsMessage(newsList, message) {
    const article = document.createElement("article");
    const paragraph = document.createElement("p");

    article.className = "lt-news-card lt-news-card--message";
    article.setAttribute("data-aos", "fade-up");
    article.setAttribute("data-aos-delay", "100");
    paragraph.textContent = message;
    article.appendChild(paragraph);

    newsList.replaceChildren(article);
  }

  function formatNewsDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return newsDateFormatter.format(date);
  }

  function getNewsArticleHref(item) {
    return `news.html?slug=${encodeURIComponent(item.slug)}`;
  }

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function refreshAOS() {
    if (!window.AOS) {
      return;
    }

    if (typeof window.AOS.refreshHard === "function") {
      window.AOS.refreshHard();
    } else if (typeof window.AOS.refresh === "function") {
      window.AOS.refresh();
    }
  }

  function initPageBehaviors() {
    syncMobileNav();
    toggleScrolled();
    toggleScrollTop();
    navmenuScrollspy();
    initSimulationPreview();
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", toggleMobileNav);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (body.classList.contains("mobile-nav-active")) {
        setMobileNavState(false);
      }
    });
  });

  if (scrollTop) {
    scrollTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initPageBehaviors();
      initNewsFeatures();
    }, { once: true });
  } else {
    initPageBehaviors();
    initNewsFeatures();
  }

  window.addEventListener("load", () => {
    initPageBehaviors();
    initNewsFeatures();
    initAOS();
    setTimeout(restoreHashScroll, 100);
  });

  window.addEventListener("pageshow", () => {
    initPageBehaviors();
    initNewsFeatures();
  });

  window.addEventListener("pagehide", () => {
    stopSimulationPreview();
  });

  window.addEventListener("hashchange", () => {
    window.setTimeout(initPageBehaviors, 0);
  });

  window.addEventListener("resize", syncMobileNav);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      initPageBehaviors();
      initNewsFeatures();
      return;
    }

    stopSimulationPreview();
  });

  document.addEventListener("scroll", () => {
    toggleScrolled();
    toggleScrollTop();
    navmenuScrollspy();
  });
})();
