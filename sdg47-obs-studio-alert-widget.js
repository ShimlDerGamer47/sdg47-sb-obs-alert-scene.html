document.addEventListener("DOMContentLoaded", () => {
  try {
    const params = new URLSearchParams(location.search);
    const client = new StreamerbotClient({
      host: params.get("host") || "127.0.0.1",
      port: parseInt(params.get("port") || 8080, 10),
      endpoint: params.get("endpoint") || "/",
      password: params.get("password") || "",
      autoReconnect: true,
      immediate: true,
      onConnect: () => {
        console.log("✅ Streamer.bot verbunden!");
      },
      onDisconnect: () => {
        console.warn("⚠️ Streamer.bot getrennt - versuche Reconnect...");
      },
      onError: () => {
        console.error("❌ Streamer.bot Verbindungsfehler!");
      },
    });

    let newFollowName = null ?? "";
    let newSubName = null ?? "";
    let newCheerName = null ?? "";
    let newRaidName = null ?? "";
    let newHostName = null ?? "";
    let newDonationName = null ?? "";

    let newFollowImgUrl = null ?? "";
    let newSubImgUrl = null ?? "";
    let newCheerImgUrl = null ?? "";
    let newRaidImgUrl = null ?? "";
    let newHostImgUrl = null ?? "";
    let newDonationImgUrl = null ?? "";

    let newLoading = null ?? 200;
    let newOnOff = null ?? 1250;
    let newDuration = null ?? 2700;

    client.on("Misc.GlobalVariableUpdated", ({ data }) => {
      if (!data || !data.name) return;

      if (data.name === "obsAlertWidgetJson") {
        const jsonValue = data.newValue;
        if (!jsonValue) {
          console.warn("⚠️ JSON Wert ist leer");
          return;
        }

        let alertData;
        try {
          alertData = JSON.parse(jsonValue);
        } catch (error) {
          console.error("❌ JSON Parse Fehler:", error, "Wert:", jsonValue);
          return;
        }

        newLoading = alertData.newLoading;
        newOnOff = alertData.newOnOff;
        newDuration = alertData.newDuration;

        resetAlertVariables();

        if (alertData.newFollowName) {
          newFollowName = alertData.newFollowName;
          newFollowImgUrl = alertData.newFollowImgUrl || "";
          console.log("🎬 FOLLOW Alert:", newFollowName);
          alertAnimationToken();
        } else if (alertData.newSubName) {
          newSubName = alertData.newSubName;
          newSubImgUrl = alertData.newSubImgUrl || "";
          console.log("🎬 SUB Alert:", newSubName);
          alertAnimationToken();
        } else if (alertData.newCheerName) {
          newCheerName = alertData.newCheerName;
          newCheerImgUrl = alertData.newCheerImgUrl || "";
          console.log("🎬 CHEER Alert:", newCheerName);
          alertAnimationToken();
        } else if (alertData.newRaidName) {
          newRaidName = alertData.newRaidName;
          newRaidImgUrl = alertData.newRaidImgUrl || "";
          console.log("🎬 RAID Alert:", newRaidName);
          alertAnimationToken();
        } else if (alertData.newHostName) {
          newHostName = alertData.newHostName;
          newHostImgUrl = alertData.newHostImgUrl || "";
          console.log("🎬 HOST Alert:", newHostName);
          alertAnimationToken();
        } else if (alertData.newDonationName) {
          newDonationName = alertData.newDonationName;
          newDonationImgUrl = alertData.newDonationImgUrl || "";
          console.log("🎬 DONATION Alert:", newDonationName);
          alertAnimationToken();
        } else {
          console.warn("⚠️ Keine Alert-Daten erkannt!");
        }
      }
    });

    const html = document.documentElement;
    const head = document.head;
    const body = document.body;

    const copy = "copy";
    const dragstart = "dragstart";
    const keydown = "keydown";
    const select = "select";

    const fontFamilyVar = "--font-family-var";
    const robotoBold = getComputedStyle(html)
      .getPropertyValue(fontFamilyVar)
      .trim();

    const none = "none";
    const def = "default";
    const hidden = "hidden";
    const visible = "visible";
    const zero = 0;
    const one = 1;

    (function htmlToken() {
      const style = document.querySelector("style");

      function dataStyleToken() {
        const followName = newFollowName;
        const subName = newSubName;
        const cheerName = newCheerName;
        const raidName = newRaidName;
        const hostName = newHostName;
        const donationName = newDonationName;

        const styleData = `
          @import url("sdg47-obs-studio-alert-widget.css");

          .follow-alert-img[alt="${followName}"],
          .sub-alert-img[alt="${subName}"],
          .cheer-alert-img[alt="${cheerName}"],
          .raid-alert-img[alt="${raidName}"],
          .host-alert-img[alt="${hostName}"],
          .donation-alert-img[alt="${donationName}"] {
            background: rgba(0, 0, 0, 0) !important;
            display: flex !important;
            align-items: center !important;
            align-content: center !important;
            justify-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            font-size: 20px !important;
            color: rgba(0, 0, 0, 0) !important;
            text-decoration: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
            cursor: default !important;
            pointer-events: none !important;
          }
        `;

        return styleData;
      }

      (function styleElToken() {
        if (head && style) {
          style.innerHTML = dataStyleToken();
        }
      })();
    })();

    (function bodyToken() {
      const eventArray = [copy, dragstart, keydown, select];

      eventArray.forEach((event) => {
        if (!event) return;

        body.addEventListener(event, (e) => e.preventDefault());
      });

      if (robotoBold.trim()) {
        Object.assign(body.style, {
          fontFamily: robotoBold,
          WebkitUserSelect: none,
          userSelect: none,
          cursor: def,
          pointerEvents: none,
        });
      }
    })();

    const diamond = "#";
    const get = (id) =>
      document.getElementById(id) || document.querySelector(diamond + id);

    const mainFollowAlertDiv = get("mainFollowAlertContainerId");

    const followAlertVideoAudioDiv = get("followAlertVideoAudioContainerId");
    const followAlertVideo = get("followAlertVideoId");
    const followAlertAudio = get("followAlertAudioId");

    const followAlertImgTextDiv = get("followAlertImgTextContainerId");
    const followAlertImgDiv = get("followAlertImgContainerId");
    const followAlertImgBgDiv = get("followAlertImgBgContainerId");
    const followAlertImg = get("followAlertImgId");

    const followAlertTextDiv = get("followAlertTextContainerId");
    const followAlertTextSpan = get("followAlertTextSpanId");

    const mainSubAlertDiv = get("mainSubAlertContainerId");

    const subAlertVideoAudioDiv = get("subAlertVideoAudioContainerId");
    const subAlertVideo = get("subAlertVideoId");
    const subAlertAudio = get("subAlertAudioId");

    const subAlertImgTextDiv = get("subAlertImgTextContainerId");
    const subAlertImgDiv = get("subAlertImgContainerId");
    const subAlertImgBgDiv = get("subAlertImgBgContainerId");
    const subAlertImg = get("subAlertImgId");

    const subAlertTextDiv = get("subAlertTextContainerId");
    const subAlertTextSpan = get("subAlertTextSpanId");

    const mainCheerAlertDiv = get("mainCheerAlertContainerId");

    const cheerAlertVideoAudioDiv = get("cheerAlertVideoAudioContainerId");
    const cheerAlertVideo = get("cheerAlertVideoId");
    const cheerAlertAudio = get("cheerAlertAudioId");

    const cheerAlertImgTextDiv = get("cheerAlertImgTextContainerId");
    const cheerAlertImgDiv = get("cheerAlertImgContainerId");
    const cheerAlertImgBgDiv = get("cheerAlertImgBgContainerId");
    const cheerAlertImg = get("cheerAlertImgId");

    const cheerAlertTextDiv = get("cheerAlertTextContainerId");
    const cheerAlertTextSpan = get("cheerAlertTextSpanId");

    const mainRaidAlertDiv = get("mainRaidAlertContainerId");

    const raidAlertVideoAudioDiv = get("raidAlertVideoAudioContainerId");
    const raidAlertVideo = get("raidAlertVideoId");
    const raidAlertAudio = get("raidAlertAudioId");

    const raidAlertImgTextDiv = get("raidwAlertImgTextContainerId");
    const raidAlertImgDiv = get("raidAlertImgContainerId");
    const raidAlertImgBgDiv = get("raidAlertImgBgContainerId");
    const raidAlertImg = get("raidAlertImgId");

    const raidAlertTextDiv = get("raidAlertTextContainerId");
    const raidAlertTextSpan = get("raidAlertTextSpanId");

    const mainHostAlertDiv = get("mainHostAlertContainerId");

    const hostAlertVideoAudioDiv = get("hostAlertVideoAudioContainerId");
    const hostAlertVideo = get("hostAlertVideoId");
    const hostAlertAudio = get("hostAlertAudioId");

    const hostAlertImgTextDiv = get("hostAlertImgTextContainerId");
    const hostAlertImgDiv = get("hostAlertImgContainerId");
    const hostAlertImgBgDiv = get("hostAlertImgBgContainerId");
    const hostAlertImg = get("hostAlertImgId");

    const hostAlertTextDiv = get("hostAlertTextContainerId");
    const hostAlertTextSpan = get("hostAlertTextSpanId");

    const mainDonationAlertDiv = get("mainDonationAlertContainerId");

    const donationAlertVideoAudioDiv = get(
      "donationAlertVideoAudioContainerId",
    );
    const donationAlertVideo = get("donationAlertVideoId");
    const donationAlertAudio = get("donationAlertAudioId");

    const donationAlertImgTextDiv = get("donationAlertImgTextContainerId");
    const donationAlertImgDiv = get("donationAlertImgContainerId");
    const donationAlertImgBgDiv = get("donationAlertImgBgContainerId");
    const donationAlertImg = get("donationAlertImgId");

    const donationAlertTextDiv = get("donationAlertTextContainerId");
    const donationAlertTextSpan = get("donationAlertTextSpanId");

    (function elementHtmlToken() {
      const elementArray = [
        mainFollowAlertDiv,
        followAlertVideoAudioDiv,
        followAlertVideo,
        followAlertAudio,
        followAlertImgTextDiv,
        followAlertImgDiv,
        followAlertImgBgDiv,
        followAlertImg,
        followAlertTextDiv,
        followAlertTextSpan,
        mainSubAlertDiv,
        subAlertVideoAudioDiv,
        subAlertVideo,
        subAlertAudio,
        subAlertImgTextDiv,
        subAlertImgDiv,
        subAlertImgBgDiv,
        subAlertImg,
        subAlertTextDiv,
        subAlertTextSpan,
        mainCheerAlertDiv,
        cheerAlertVideoAudioDiv,
        cheerAlertVideo,
        cheerAlertAudio,
        cheerAlertImgTextDiv,
        cheerAlertImgDiv,
        cheerAlertImgBgDiv,
        cheerAlertImg,
        cheerAlertTextDiv,
        cheerAlertTextSpan,
        mainRaidAlertDiv,
        raidAlertVideoAudioDiv,
        raidAlertVideo,
        raidAlertAudio,
        raidAlertImgTextDiv,
        raidAlertImgDiv,
        raidAlertImgBgDiv,
        raidAlertImg,
        raidAlertTextDiv,
        raidAlertTextSpan,
        mainHostAlertDiv,
        hostAlertVideoAudioDiv,
        hostAlertVideo,
        hostAlertAudio,
        hostAlertImgTextDiv,
        hostAlertImgDiv,
        hostAlertImgBgDiv,
        hostAlertImg,
        hostAlertTextDiv,
        hostAlertTextSpan,
        mainDonationAlertDiv,
        donationAlertVideoAudioDiv,
        donationAlertVideo,
        donationAlertAudio,
        donationAlertImgTextDiv,
        donationAlertImgDiv,
        donationAlertImgBgDiv,
        donationAlertImg,
        donationAlertTextDiv,
        donationAlertTextSpan,
      ];
      const eventArray = [copy, dragstart, keydown, select];

      elementArray.forEach((element) => {
        if (!element) return;

        eventArray.forEach((event) => {
          if (!event) return;

          element.addEventListener(event, (e) => e.preventDefault());
        });
      });

      elementArray.filter(Boolean).forEach((element) => {
        if (!element) return;

        if (robotoBold.trim()) {
          Object.assign(element.style, {
            fontFamily: robotoBold,
            WebkitUserSelect: none,
            userSelect: none,
            cursor: def,
            pointerEvents: none,
          });
        }
      });
    })();

    (function obsAlertOverlay() {
      const followPathFileVideo =
        "Alert Ordner/Video Ordner/Iridos-alert-follower.webm";
      const followPathFileAudio = "Alert Ordner/Audio Ordner/Follow.wav";

      const subPathFileVideo =
        "Alert Ordner/Video Ordner/Iridos-alert-subscriber.webm";
      const subPathFileAudio = "Alert Ordner/Audio Ordner/Subscriber.wav";

      const cheerPathFileVideo =
        "Alert Ordner/Video Ordner/Iridos-alert-cheer.webm";
      const cheerPathFileAudio = "Alert Ordner/Audio Ordner/Cheer.wav";

      const raidPathFileVideo =
        "Alert Ordner/Video Ordner/Iridos-alert-raid.webm";
      const raidPathFileAudio = "Alert Ordner/Audio Ordner/Raid.wav";

      const hostPathFileVideo =
        "Alert Ordner/Video Ordner/Iridos-alert-host.webm";
      const hostPathFileAudio = "Alert Ordner/Audio Ordner/Host.wav";

      const donationPathFileVideo =
        "Alert Ordner/Video Ordner/Iridos-alert-donation.webm";
      const donationPathFileAudio = "Alert Ordner/Audio Ordner/Donation.wav";

      if (
        (followAlertVideoAudioDiv &&
          !followAlertVideo.src &&
          !followAlertAudio.src) ||
        (followAlertVideoAudioDiv &&
          !followAlertVideo.error &&
          !followAlertAudio.error)
      ) {
        followAlertVideo.src = followPathFileVideo;
        followAlertAudio.src = followPathFileAudio;
      }

      if (
        (subAlertVideoAudioDiv && !subAlertVideo.src && !subAlertAudio.src) ||
        (subAlertVideoAudioDiv && !subAlertVideo.error && !subAlertAudio.error)
      ) {
        subAlertVideo.src = subPathFileVideo;
        subAlertAudio.src = subPathFileAudio;
      }

      if (
        (cheerAlertVideoAudioDiv &&
          !cheerAlertVideo.src &&
          !cheerAlertAudio.src) ||
        (cheerAlertVideoAudioDiv &&
          !cheerAlertVideo.error &&
          !cheerAlertAudio.error)
      ) {
        cheerAlertVideo.src = cheerPathFileVideo;
        cheerAlertAudio.src = cheerPathFileAudio;
      }

      if (
        (raidAlertVideoAudioDiv &&
          !raidAlertVideo.src &&
          !raidAlertAudio.src) ||
        (raidAlertVideoAudioDiv &&
          !raidAlertVideo.error &&
          !raidAlertAudio.error)
      ) {
        raidAlertVideo.src = raidPathFileVideo;
        raidAlertAudio.src = raidPathFileAudio;
      }

      if (
        (hostAlertVideoAudioDiv &&
          !hostAlertVideo.src &&
          !hostAlertAudio.src) ||
        (hostAlertVideoAudioDiv &&
          !hostAlertVideo.error &&
          !hostAlertAudio.error)
      ) {
        hostAlertVideo.src = hostPathFileVideo;
        hostAlertAudio.src = hostPathFileAudio;
      }

      if (
        (donationAlertVideoAudioDiv &&
          !donationAlertVideo.src &&
          !donationAlertAudio.src) ||
        (donationAlertVideoAudioDiv &&
          !donationAlertVideo.error &&
          !donationAlertAudio.error)
      ) {
        donationAlertVideo.src = donationPathFileVideo;
        donationAlertAudio.src = donationPathFileAudio;
      }
    })();

    (function clearsToken() {
      (function imgElClearToken() {
        const clear = "";

        const elementArray = [
          followAlertImg,
          subAlertImg,
          cheerAlertImg,
          raidAlertImg,
          hostAlertImg,
          donationAlertImg,
        ];

        elementArray.forEach((element) => {
          if (!element) return;

          element.src = clear;
          element.alt = clear;
        });
      })();

      (function textClearToken() {
        const clear = "";

        const elementArray = [
          followAlertTextSpan,
          subAlertTextSpan,
          cheerAlertTextSpan,
          raidAlertTextSpan,
          hostAlertTextSpan,
          donationAlertTextSpan,
        ];

        elementArray.forEach((element) => {
          if (!element) return;

          element.innerText = clear;
        });
      })();
    })();

    function setAlertToken() {
      const followName = newFollowName;
      const subName = newSubName;
      const cheerName = newCheerName;
      const raidName = newRaidName;
      const hostName = newHostName;
      const donationName = newDonationName;

      const followImgUrl = newFollowImgUrl;
      const subImgUrl = newSubImgUrl;
      const cheerImgUrl = newCheerImgUrl;
      const raidImgUrl = newRaidImgUrl;
      const hostImgUrl = newHostImgUrl;
      const donationImgUrl = newDonationImgUrl;

      if (followName.trim()) {
        if (followAlertImgBgDiv && followAlertImg) {
          followAlertImg.src = followImgUrl;
          followAlertImg.alt = followName;
        }

        if (followAlertTextDiv && followAlertTextSpan)
          followAlertTextSpan.textContent = followName;
      } else if (subName.trim()) {
        if (subAlertImgBgDiv && subAlertImg) {
          subAlertImg.src = subImgUrl;
          subAlertImg.alt = subName;
        }

        if (subAlertTextDiv && subAlertTextSpan)
          subAlertTextSpan.textContent = subName;
      } else if (cheerName.trim()) {
        if (cheerAlertImgBgDiv && cheerAlertImg) {
          cheerAlertImg.src = cheerImgUrl;
          cheerAlertImg.alt = cheerName;
        }

        if (cheerAlertTextDiv && cheerAlertTextSpan)
          cheerAlertTextSpan.textContent = cheerName;
      } else if (raidName.trim()) {
        if (raidAlertImgBgDiv && raidAlertImg) {
          raidAlertImg.src = raidImgUrl;
          raidAlertImg.alt = raidName;
        }

        if (raidAlertTextDiv && raidAlertTextSpan)
          raidAlertTextSpan.textContent = raidName;
      } else if (hostName.trim()) {
        if (hostAlertImgBgDiv && hostAlertImg) {
          hostAlertImg.src = hostImgUrl;
          hostAlertImg.alt = hostName;
        }

        if (hostAlertTextDiv && hostAlertTextSpan)
          hostAlertTextSpan.textContent = hostName;
      } else if (donationName.trim()) {
        if (donationAlertImgBgDiv && donationAlertImg) {
          donationAlertImg.src = donationImgUrl;
          donationAlertImg.alt = donationName;
        }

        if (donationAlertTextDiv && donationAlertTextSpan)
          donationAlertTextSpan.textContent = donationName;
      }
    }

    function hiddenToken() {
      const elementArray = [
        followAlertVideo,
        followAlertImgBgDiv,
        followAlertTextSpan,
        subAlertVideo,
        subAlertImgBgDiv,
        subAlertTextSpan,
        cheerAlertVideo,
        cheerAlertImgBgDiv,
        cheerAlertTextSpan,
        raidAlertVideo,
        raidAlertImgBgDiv,
        raidAlertTextSpan,
        hostAlertVideo,
        hostAlertImgBgDiv,
        hostAlertTextSpan,
        donationAlertVideo,
        donationAlertImgBgDiv,
        donationAlertTextSpan,
      ].filter(Boolean);

      elementArray.forEach((element) => {
        if (!element) return;

        element.style.visibility = hidden;
        element.style.opacity = zero;
      });
    }
    hiddenToken();

    function resetAlertVariables() {
      newFollowName = null ?? "";
      newSubName = null ?? "";
      newCheerName = null ?? "";
      newRaidName = null ?? "";
      newHostName = null ?? "";
      newDonationName = null ?? "";

      newFollowImgUrl = null ?? "";
      newSubImgUrl = null ?? "";
      newCheerImgUrl = null ?? "";
      newRaidImgUrl = null ?? "";
      newHostImgUrl = null ?? "";
      newDonationImgUrl = null ?? "";
    }

    function innersAllTokens() {
      setAlertToken();
      hiddenToken();
    }

    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    async function alertAnimationToken() {
      try {
        const followerNameNew = newFollowName;
        const subscriptionNameNew = newSubName;
        const cheerNameNew = newCheerName;
        const raidNameNew = newRaidName;
        const hostNameNew = newHostName;
        const donationNameNew = newDonationName;

        const loading = newLoading;
        const onOff = newOnOff;
        const duration = newDuration;

        const cssClassSlideInImgAlert = "slide-in-img-alert";
        const cssClassSlideOutImgAlert = "slide-out-img-alert";
        const cssClassSlideInTextAlert = "slide-in-text-alert";
        const cssClassSlideOutTextAlert = "slide-out-text-alert";

        const displayPorperty = "display";

        innersAllTokens();

        await wait(loading);

        if (followerNameNew.trim()) {
          [
            mainSubAlertDiv,
            mainCheerAlertDiv,
            mainRaidAlertDiv,
            mainHostAlertDiv,
            mainDonationAlertDiv,
          ]
            .filter(Boolean)
            .forEach((element) => {
              if (!element) return;

              element.style.display = none;
            });

          followAlertVideo.style.visibility = visible;
          followAlertVideo.style.opacity = one;

          if (followAlertVideo.src && followAlertAudio.src) {
            followAlertVideo.currentTime = zero;
            followAlertAudio.currentTime = zero;

            await Promise.all([
              followAlertVideo.readyState >= 3
                ? Promise.resolve()
                : new Promise((r) =>
                    followAlertVideo.addEventListener("canplay", r, {
                      once: true,
                    }),
                  ),
              followAlertAudio.readyState >= 3
                ? Promise.resolve()
                : new Promise((r) =>
                    followAlertAudio.addEventListener("canplay", r, {
                      once: true,
                    }),
                  ),
            ]);

            await Promise.all([
              followAlertVideo
                .play()
                .catch((e) => console.error("❌ Video Fehler:", e)),
              followAlertAudio
                .play()
                .catch((e) => console.error("❌ Audio Fehler:", e)),
            ]);
          }
          await wait(onOff);

          followAlertImgBgDiv.style.visibility = visible;
          followAlertImgBgDiv.style.opacity = one;
          followAlertImgBgDiv.classList.remove(cssClassSlideOutImgAlert);
          followAlertImgBgDiv.classList.add(cssClassSlideInImgAlert);
          await wait(onOff);

          followAlertTextSpan.style.visibility = visible;
          followAlertTextSpan.style.opacity = one;
          followAlertTextSpan.classList.remove(cssClassSlideOutTextAlert);
          followAlertTextSpan.classList.add(cssClassSlideInTextAlert);
          await wait(onOff);

          await wait(duration);

          followAlertTextSpan.classList.remove(cssClassSlideInTextAlert);
          followAlertTextSpan.classList.add(cssClassSlideOutTextAlert);
          followAlertTextSpan.style.visibility = hidden;
          followAlertTextSpan.style.opacity = zero;
          await wait(onOff);

          followAlertImgBgDiv.classList.remove(cssClassSlideInImgAlert);
          followAlertImgBgDiv.classList.add(cssClassSlideOutImgAlert);
          followAlertImgBgDiv.style.visibility = hidden;
          followAlertImgBgDiv.style.opacity = zero;
          await wait(onOff);

          followAlertVideo.style.visibility = hidden;
          followAlertVideo.style.opacity = zero;

          [
            mainSubAlertDiv,
            mainCheerAlertDiv,
            mainRaidAlertDiv,
            mainHostAlertDiv,
            mainDonationAlertDiv,
          ]
            .filter(Boolean)
            .forEach((element) => {
              if (!element) return;

              element.style.removeProperty(displayPorperty);
            });

          followAlertImgBgDiv.classList.remove(
            cssClassSlideInImgAlert,
            cssClassSlideOutImgAlert,
          );
          followAlertTextSpan.classList.remove(
            cssClassSlideInTextAlert,
            cssClassSlideOutTextAlert,
          );
          resetAlertVariables();
        } else if (subscriptionNameNew.trim()) {
          [
            mainFollowAlertDiv,
            mainCheerAlertDiv,
            mainRaidAlertDiv,
            mainHostAlertDiv,
            mainDonationAlertDiv,
          ]
            .filter(Boolean)
            .forEach((element) => {
              if (!element) return;

              element.style.display = none;
            });

          subAlertVideo.style.visibility = visible;
          subAlertVideo.style.opacity = one;

          if (subAlertVideo.src && subAlertAudio.src) {
            subAlertVideo.currentTime = zero;
            subAlertAudio.currentTime = zero;

            await Promise.all([
              subAlertVideo.readyState >= 3
                ? Promise.resolve()
                : new Promise((r) =>
                    subAlertVideo.addEventListener("canplay", r, {
                      once: true,
                    }),
                  ),
              subAlertAudio.readyState >= 3
                ? Promise.resolve()
                : new Promise((r) =>
                    subAlertAudio.addEventListener("canplay", r, {
                      once: true,
                    }),
                  ),
            ]);

            await Promise.all([
              subAlertVideo
                .play()
                .catch((e) => console.error("❌ Video Fehler:", e)),
              subAlertAudio
                .play()
                .catch((e) => console.error("❌ Audio Fehler:", e)),
            ]);
          }
          await wait(onOff);

          subAlertImgBgDiv.style.visibility = visible;
          subAlertImgBgDiv.style.opacity = one;
          subAlertImgBgDiv.classList.remove(cssClassSlideOutImgAlert);
          subAlertImgBgDiv.classList.add(cssClassSlideInImgAlert);
          await wait(onOff);

          subAlertTextSpan.style.visibility = visible;
          subAlertTextSpan.style.opacity = one;
          subAlertTextSpan.classList.remove(cssClassSlideOutTextAlert);
          subAlertTextSpan.classList.add(cssClassSlideInTextAlert);
          await wait(onOff);

          await wait(duration);

          subAlertTextSpan.classList.remove(cssClassSlideInTextAlert);
          subAlertTextSpan.classList.add(cssClassSlideOutTextAlert);
          subAlertTextSpan.style.visibility = hidden;
          subAlertTextSpan.style.opacity = zero;
          await wait(onOff);

          subAlertImgBgDiv.classList.remove(cssClassSlideInImgAlert);
          subAlertImgBgDiv.classList.add(cssClassSlideOutImgAlert);
          subAlertImgBgDiv.style.visibility = hidden;
          subAlertImgBgDiv.style.opacity = zero;
          await wait(onOff);

          subAlertVideo.style.visibility = hidden;
          subAlertVideo.style.opacity = zero;

          [
            mainFollowAlertDiv,
            mainCheerAlertDiv,
            mainRaidAlertDiv,
            mainHostAlertDiv,
            mainDonationAlertDiv,
          ]
            .filter(Boolean)
            .forEach((element) => {
              if (!element) return;

              element.style.removeProperty(displayPorperty);
            });

          subAlertImgBgDiv.classList.remove(
            cssClassSlideInImgAlert,
            cssClassSlideOutImgAlert,
          );
          subAlertTextSpan.classList.remove(
            cssClassSlideInTextAlert,
            cssClassSlideOutTextAlert,
          );
          resetAlertVariables();
        } else if (cheerNameNew) {
          [
            mainFollowAlertDiv,
            mainSubAlertDiv,
            mainRaidAlertDiv,
            mainHostAlertDiv,
            mainDonationAlertDiv,
          ]
            .filter(Boolean)
            .forEach((element) => {
              if (!element) return;

              element.style.display = none;
            });

          cheerAlertVideo.style.visibility = visible;
          cheerAlertVideo.style.opacity = one;

          if (cheerAlertVideo.src && cheerAlertAudio.src) {
            cheerAlertVideo.currentTime = zero;
            cheerAlertAudio.currentTime = zero;

            await Promise.all([
              cheerAlertVideo.readyState >= 3
                ? Promise.resolve()
                : new Promise((r) =>
                    cheerAlertVideo.addEventListener("canplay", r, {
                      once: true,
                    }),
                  ),
              cheerAlertAudio.readyState >= 3
                ? Promise.resolve()
                : new Promise((r) =>
                    cheerAlertAudio.addEventListener("canplay", r, {
                      once: true,
                    }),
                  ),
            ]);

            await Promise.all([
              cheerAlertVideo
                .play()
                .catch((e) => console.error("❌ Video Fehler:", e)),
              cheerAlertAudio
                .play()
                .catch((e) => console.error("❌ Audio Fehler:", e)),
            ]);
          }
          await wait(onOff);

          cheerAlertImgBgDiv.style.visibility = visible;
          cheerAlertImgBgDiv.style.opacity = one;
          cheerAlertImgBgDiv.classList.remove(cssClassSlideOutImgAlert);
          cheerAlertImgBgDiv.classList.add(cssClassSlideInImgAlert);
          await wait(onOff);

          cheerAlertTextSpan.style.visibility = visible;
          cheerAlertTextSpan.style.opacity = one;
          cheerAlertTextSpan.classList.remove(cssClassSlideOutTextAlert);
          cheerAlertTextSpan.classList.add(cssClassSlideInTextAlert);
          await wait(onOff);

          await wait(duration);

          cheerAlertTextSpan.classList.remove(cssClassSlideInTextAlert);
          cheerAlertTextSpan.classList.add(cssClassSlideOutTextAlert);
          cheerAlertTextSpan.style.visibility = hidden;
          cheerAlertTextSpan.style.opacity = zero;
          await wait(onOff);

          cheerAlertImgBgDiv.classList.remove(cssClassSlideInImgAlert);
          cheerAlertImgBgDiv.classList.add(cssClassSlideOutImgAlert);
          cheerAlertImgBgDiv.style.visibility = hidden;
          cheerAlertImgBgDiv.style.opacity = zero;
          await wait(onOff);

          cheerAlertVideo.style.visibility = hidden;
          cheerAlertVideo.style.opacity = zero;

          [
            mainFollowAlertDiv,
            mainSubAlertDiv,
            mainRaidAlertDiv,
            mainHostAlertDiv,
            mainDonationAlertDiv,
          ]
            .filter(Boolean)
            .forEach((element) => {
              if (!element) return;

              element.style.removeProperty(displayPorperty);
            });

          cheerAlertImgBgDiv.classList.remove(
            cssClassSlideInImgAlert,
            cssClassSlideOutImgAlert,
          );
          cheerAlertTextSpan.classList.remove(
            cssClassSlideInTextAlert,
            cssClassSlideOutTextAlert,
          );
          resetAlertVariables();
        } else if (raidNameNew.trim()) {
          [
            mainFollowAlertDiv,
            mainSubAlertDiv,
            mainCheerAlertDiv,
            mainHostAlertDiv,
            mainDonationAlertDiv,
          ]
            .filter(Boolean)
            .forEach((element) => {
              if (!element) return;

              element.style.display = none;
            });

          raidAlertVideo.style.visibility = visible;
          raidAlertVideo.style.opacity = one;

          if (raidAlertVideo.src && raidAlertAudio.src) {
            raidAlertVideo.currentTime = zero;
            raidAlertAudio.currentTime = zero;

            await Promise.all([
              raidAlertVideo.readyState >= 3
                ? Promise.resolve()
                : new Promise((r) =>
                    raidAlertVideo.addEventListener("canplay", r, {
                      once: true,
                    }),
                  ),
              raidAlertAudio.readyState >= 3
                ? Promise.resolve()
                : new Promise((r) =>
                    raidAlertAudio.addEventListener("canplay", r, {
                      once: true,
                    }),
                  ),
            ]);

            await Promise.all([
              raidAlertVideo
                .play()
                .catch((e) => console.error("❌ Video Fehler:", e)),
              raidAlertAudio
                .play()
                .catch((e) => console.error("❌ Audio Fehler:", e)),
            ]);
          }
          await wait(onOff);

          raidAlertImgBgDiv.style.visibility = visible;
          raidAlertImgBgDiv.style.opacity = one;
          raidAlertImgBgDiv.classList.remove(cssClassSlideOutImgAlert);
          raidAlertImgBgDiv.classList.add(cssClassSlideInImgAlert);
          await wait(onOff);

          raidAlertTextSpan.style.visibility = visible;
          raidAlertTextSpan.style.opacity = one;
          raidAlertTextSpan.classList.remove(cssClassSlideOutTextAlert);
          raidAlertTextSpan.classList.add(cssClassSlideInTextAlert);
          await wait(onOff);

          await wait(duration);

          raidAlertTextSpan.classList.remove(cssClassSlideInTextAlert);
          raidAlertTextSpan.classList.add(cssClassSlideOutTextAlert);
          raidAlertTextSpan.style.visibility = hidden;
          raidAlertTextSpan.style.opacity = zero;
          await wait(onOff);

          raidAlertImgBgDiv.classList.remove(cssClassSlideInImgAlert);
          raidAlertImgBgDiv.classList.add(cssClassSlideOutImgAlert);
          raidAlertImgBgDiv.style.visibility = hidden;
          raidAlertImgBgDiv.style.opacity = zero;
          await wait(onOff);

          raidAlertVideo.style.visibility = hidden;
          raidAlertVideo.style.opacity = zero;

          [
            mainFollowAlertDiv,
            mainSubAlertDiv,
            mainCheerAlertDiv,
            mainHostAlertDiv,
            mainDonationAlertDiv,
          ]
            .filter(Boolean)
            .forEach((element) => {
              if (!element) return;

              element.style.removeProperty(displayPorperty);
            });

          raidAlertTextSpan.classList.remove(
            cssClassSlideInTextAlert,
            cssClassSlideOutTextAlert,
          );
          raidAlertImgBgDiv.classList.remove(
            cssClassSlideInImgAlert,
            cssClassSlideOutImgAlert,
          );
          resetAlertVariables();
        } else if (hostNameNew.trim()) {
          [
            mainFollowAlertDiv,
            mainSubAlertDiv,
            mainCheerAlertDiv,
            mainRaidAlertDiv,
            mainDonationAlertDiv,
          ]
            .filter(Boolean)
            .forEach((element) => {
              if (!element) return;

              element.style.display = none;
            });

          hostAlertVideo.style.visibility = visible;
          hostAlertVideo.style.opacity = one;

          if (hostAlertVideo.src && hostAlertAudio.src) {
            hostAlertVideo.currentTime = zero;
            hostAlertAudio.currentTime = zero;

            await Promise.all([
              hostAlertVideo.readyState >= 3
                ? Promise.resolve()
                : new Promise((r) =>
                    hostAlertVideo.addEventListener("canplay", r, {
                      once: true,
                    }),
                  ),
              hostAlertAudio.readyState >= 3
                ? Promise.resolve()
                : new Promise((r) =>
                    hostAlertAudio.addEventListener("canplay", r, {
                      once: true,
                    }),
                  ),
            ]);

            await Promise.all([
              hostAlertVideo
                .play()
                .catch((e) => console.error("❌ Video Fehler:", e)),
              hostAlertAudio
                .play()
                .catch((e) => console.error("❌ Audio Fehler:", e)),
            ]);
          }
          await wait(onOff);

          hostAlertImgBgDiv.style.visibility = visible;
          hostAlertImgBgDiv.style.opacity = one;
          hostAlertImgBgDiv.classList.remove(cssClassSlideOutImgAlert);
          hostAlertImgBgDiv.classList.add(cssClassSlideInImgAlert);
          await wait(onOff);

          hostAlertTextSpan.style.visibility = visible;
          hostAlertTextSpan.style.opacity = one;
          hostAlertTextSpan.classList.remove(cssClassSlideOutTextAlert);
          hostAlertTextSpan.classList.add(cssClassSlideInTextAlert);
          await wait(onOff);

          await wait(duration);

          hostAlertTextSpan.classList.remove(cssClassSlideInTextAlert);
          hostAlertTextSpan.classList.add(cssClassSlideOutTextAlert);
          hostAlertTextSpan.style.visibility = hidden;
          hostAlertTextSpan.style.opacity = zero;
          await wait(onOff);

          hostAlertImgBgDiv.classList.remove(cssClassSlideInImgAlert);
          hostAlertImgBgDiv.classList.add(cssClassSlideOutImgAlert);
          hostAlertImgBgDiv.style.visibility = hidden;
          hostAlertImgBgDiv.style.opacity = zero;
          await wait(onOff);

          hostAlertVideo.style.visibility = hidden;
          hostAlertVideo.style.opacity = zero;

          [
            mainFollowAlertDiv,
            mainSubAlertDiv,
            mainCheerAlertDiv,
            mainRaidAlertDiv,
            mainDonationAlertDiv,
          ]
            .filter(Boolean)
            .forEach((element) => {
              if (!element) return;

              element.style.removeProperty(displayPorperty);
            });

          hostAlertTextSpan.classList.remove(
            cssClassSlideInTextAlert,
            cssClassSlideOutTextAlert,
          );
          hostAlertImgBgDiv.classList.remove(
            cssClassSlideInImgAlert,
            cssClassSlideOutImgAlert,
          );
          resetAlertVariables();
        } else if (donationNameNew.trim()) {
          [
            mainFollowAlertDiv,
            mainSubAlertDiv,
            mainCheerAlertDiv,
            mainRaidAlertDiv,
            mainHostAlertDiv,
          ]
            .filter(Boolean)
            .forEach((element) => {
              if (!element) return;

              element.style.display = none;
            });

          donationAlertVideo.style.visibility = visible;
          donationAlertVideo.style.opacity = one;

          if (donationAlertVideo.src && donationAlertAudio.src) {
            donationAlertVideo.currentTime = zero;
            donationAlertAudio.currentTime = zero;

            await Promise.all([
              donationAlertVideo.readyState >= 3
                ? Promise.resolve()
                : new Promise((r) =>
                    donationAlertVideo.addEventListener("canplay", r, {
                      once: true,
                    }),
                  ),
              donationAlertAudio.readyState >= 3
                ? Promise.resolve()
                : new Promise((r) =>
                    donationAlertAudio.addEventListener("canplay", r, {
                      once: true,
                    }),
                  ),
            ]);

            await Promise.all([
              donationAlertVideo
                .play()
                .catch((e) => console.error("❌ Video Fehler:", e)),
              donationAlertAudio
                .play()
                .catch((e) => console.error("❌ Audio Fehler:", e)),
            ]);
          }
          await wait(onOff);

          donationAlertImgBgDiv.style.visibility = visible;
          donationAlertImgBgDiv.style.opacity = one;
          donationAlertImgBgDiv.classList.remove(cssClassSlideOutImgAlert);
          donationAlertImgBgDiv.classList.add(cssClassSlideInImgAlert);
          await wait(onOff);

          donationAlertTextSpan.style.visibility = visible;
          donationAlertTextSpan.style.opacity = one;
          donationAlertTextSpan.classList.remove(cssClassSlideOutTextAlert);
          donationAlertTextSpan.classList.add(cssClassSlideInTextAlert);
          await wait(onOff);

          await wait(duration);

          donationAlertTextSpan.classList.remove(cssClassSlideInTextAlert);
          donationAlertTextSpan.classList.add(cssClassSlideOutTextAlert);
          donationAlertTextSpan.style.visibility = hidden;
          donationAlertTextSpan.style.opacity = zero;
          await wait(onOff);

          donationAlertImgBgDiv.classList.remove(cssClassSlideInImgAlert);
          donationAlertImgBgDiv.classList.add(cssClassSlideOutImgAlert);
          donationAlertImgBgDiv.style.visibility = hidden;
          donationAlertImgBgDiv.style.opacity = zero;
          await wait(onOff);

          donationAlertVideo.style.visibility = hidden;
          donationAlertVideo.style.opacity = zero;

          [
            mainFollowAlertDiv,
            mainSubAlertDiv,
            mainCheerAlertDiv,
            mainRaidAlertDiv,
            mainHostAlertDiv,
          ]
            .filter(Boolean)
            .forEach((element) => {
              if (!element) return;

              element.style.removeProperty(displayPorperty);
            });

          donationAlertImgBgDiv.classList.remove(
            cssClassSlideInImgAlert,
            cssClassSlideOutImgAlert,
          );
          donationAlertTextSpan.classList.remove(
            cssClassSlideInTextAlert,
            cssClassSlideOutTextAlert,
          );
          resetAlertVariables();
        }
      } catch (error) {
        console.error("Alert-Fehler:", error);
      }
    }

    let breatheBlur = 10;
    let breatheDirection = 1;

    function randomColorFilterToken() {
      const rOne = Math.floor(Math.random() * 256);
      const gOne = Math.floor(Math.random() * 256);
      const bOne = Math.floor(Math.random() * 256);

      const rTwo = Math.floor(Math.random() * 256);
      const gTwo = Math.floor(Math.random() * 256);
      const bTwo = Math.floor(Math.random() * 256);

      breatheBlur += breatheDirection * 1;
      if (breatheBlur >= 11) breatheDirection = -1;
      if (breatheBlur <= 5) breatheDirection = 1;

      const randomFilterColor = `
        drop-shadow(0 0 2.5px rgba(0, 0, 0, 0.25))
        drop-shadow(0 0 ${breatheBlur}px rgba(${rOne}, ${gOne}, ${bOne}, 0.8))
        drop-shadow(0 0 ${breatheBlur}px rgba(${rTwo}, ${gTwo}, ${bTwo}, 0.8))
        drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))
      `;
      const transitionProperty =
        "filter 1.5s cubic-bezier(0.445, 0.05, 0.55, 0.95)";

      const elementArray = [
        followAlertVideoAudioDiv,
        followAlertImgDiv,
        followAlertTextSpan,
        subAlertVideoAudioDiv,
        subAlertImgDiv,
        subAlertTextSpan,
        cheerAlertVideoAudioDiv,
        cheerAlertImgDiv,
        cheerAlertTextSpan,
        raidAlertVideoAudioDiv,
        raidAlertImgDiv,
        raidAlertTextSpan,
        hostAlertVideoAudioDiv,
        hostAlertImgDiv,
        hostAlertTextSpan,
        donationAlertVideoAudioDiv,
        donationAlertImgDiv,
        donationAlertTextSpan,
      ].filter(Boolean);

      elementArray.forEach((element) => {
        if (!element) return;

        element.style.filter = randomFilterColor;
        element.style.transition = transitionProperty;
      });
    }

    setInterval(randomColorFilterToken, 1000);
  } catch (error) {
    console.error("Haupt-Fehler:", error);
  }
});
