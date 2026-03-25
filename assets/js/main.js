(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector("#header");
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");
  const scrollTop = document.querySelector(".scroll-top");
  const preloader = document.querySelector("#preloader");
  const navLinks = Array.from(document.querySelectorAll(".navmenu a"));

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

  function toggleMobileNav() {
    if (!mobileNavToggleBtn) {
      return;
    }

    body.classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
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
    const epochMs = Date.parse("2026-03-23T08:00:00Z");
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

    function formatSimulationClock(elapsedSeconds) {
      return `${clockFormatter.format(new Date(epochMs + (Math.round(elapsedSeconds) * 1000)))} UTC`;
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

    function renderFrame(now) {
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

      clock.textContent = formatSimulationClock(elapsedSimulationSeconds);
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

      window.requestAnimationFrame(renderFrame);
    }

    window.requestAnimationFrame(renderFrame);

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

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", toggleMobileNav);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (body.classList.contains("mobile-nav-active")) {
        toggleMobileNav();
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

  window.addEventListener("load", () => {
    toggleScrolled();
    toggleScrollTop();
    initAOS();
    initSimulationPreview();
    setTimeout(restoreHashScroll, 100);
    navmenuScrollspy();
  });

  document.addEventListener("scroll", () => {
    toggleScrolled();
    toggleScrollTop();
    navmenuScrollspy();
  });
})();
