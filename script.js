console.log("Working......");

// const CLIENT_ID = "03e1246f74609413a";
const API_KEY = "AIzaSyA7tHWWOHmzrw7fdE6LXN7jn7ZKiX6g8GY";
const client_id =
  "474928881080-n0l6nr29bbnjuheepj3cvuvf588u4q14.apps.googleusercontent.com";

let query = "";
let youtubeData = [];
let videosWithDetails = [];
const pageTokenList = [];

let search = document
  .getElementById("pse-search")
  .addEventListener("click", searchHandler);
let nextBtnHandler = document
  .getElementById("pse-next-btn")
  .addEventListener("click", nextPageHandler);
let prevBtnHandler = document
  .getElementById("pse-prev-btn")
  .addEventListener("click", prevPageHandler);

async function fetchYoutubeApi() {
  document.getElementById("pse-search-param").innerHTML = query;
  const bodyContainer = document.getElementById("pse-card-stack-contianer");
  const bodySubContainer =
    bodyContainer?.getElementsByClassName("pse-card-container");
  let pageToken =
    pageTokenList.length === 0
      ? ""
      : `&pageToken=${pageTokenList[pageTokenList.length - 1]}`;
  let randomURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=Music&key=${API_KEY}&num=5${pageToken}`;
  let searchURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&key=${API_KEY}&num=5${pageToken}`;
  let url = query ? searchURL : randomURL;
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      videosWithDetails = [];
      youtubeData = [];
      youtubeData.push(data);
      console.log("Data :", data);
      //   videos in details;
      data.items?.map((item) => {
        const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${item.id.videoId}&key=${API_KEY}`;

        fetch(videoDetailsUrl)
          .then((response) => response.json())
          .then((videoData) => {
            console.log(
              "49:",
              videoData.items[0]?.snippet?.thumbnails?.high?.url
            );
            if (videoData.item !== "undefined") {
              //   videosWithDetails.push({
              //     videoId: videoData.items[0]?.id,
              //     videoDuration: videoData.items[0]?.contentDetails?.duration,
              //     channelID: videoData.items[0]?.snippet?.channelId,
              //     channelHeader: videoData.items[0]?.snippet?.channelTitle,
              //     description: videoData.items[0]?.snippet?.description,
              //     videoPreviewLink: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              //     officialLink: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              //     views: formatYouTubeViews(
              //       videoData.items[0]?.statistics.viewCount
              //     ),
              //   });
              //   data.items?.map((el) => {
              // create a card

              const card = document.createElement("div");
              card.className = "pse-card-container";
              card.setAttribute("id", "pse-card");

              card.addEventListener("click", () =>
                PreviewComponent(videoData.items[0]?.id)
              );

              bodyContainer?.appendChild(card);

              //image comp
              const thumbnailSection = document.createElement("div");
              thumbnailSection.className = "pse-thumbnail-section";

              const thumbnail = document.createElement("img");
              thumbnail.className = "pse-thumbnail-container";
              thumbnail.setAttribute(
                "src",
                videoData.items[0]?.snippet?.thumbnails?.high?.url
              );

              const vidDuration = document.createElement("div");
              vidDuration.className = "pse-video-duration";
              vidDuration.innerHTML = convertDuration(
                videoData.items[0]?.contentDetails?.duration
              );

              thumbnailSection.appendChild(thumbnail);
              thumbnailSection.appendChild(vidDuration);

              //discription section
              const discriptionSection = document.createElement("div");
              discriptionSection.className = "pse-discription-section";

              //title and url with channelTile
              //title
              const vidTitle = document.createElement("div");
              vidTitle.className = "pse-vid-title";
              vidTitle.textContent =
                videoData.items[0]?.snippet?.description.slice(0, 46) + "...";
              bodyContainer.appendChild(vidTitle);

              //channel name
              const channelTitle = document.createElement("div");
              channelTitle.className = "pse-channel-title-txt";
              channelTitle.innerHTML =
                videoData.items[0]?.snippet?.channelTitle;

              //youtube url
              const youtubeContianer = document.createElement("div");
              youtubeContianer.className = "pse-youtube-contianer";

              const ytLogo = document.createElement("img");
              ytLogo.className = "pse-ytLogo";
              ytLogo.setAttribute("src", "./icons/bgyoutube.svg");

              const youtubetxt = document.createElement("div");
              youtubetxt.className = "pse-youtube-txt";
              youtubetxt.textContent = "Youtube.com";

              youtubeContianer.appendChild(ytLogo);
              youtubeContianer.appendChild(youtubetxt);

              //title and channel name in one contianer
              const vidDisc = document.createElement("div");
              vidDisc.className = "pse-channel-discription-container";

              vidDisc.appendChild(vidTitle);
              vidDisc.appendChild(channelTitle);

              //link and views name in one contianer
              const vidDiscBottom = document.createElement("div");
              vidDiscBottom.className =
                "pse-channel-discription-bottom-container";

              const vidViews = document.createElement("div");
              vidViews.className = "pse-video-view-contianer";
              vidViews.innerHTML =
                formatYouTubeViews(videoData.items[0]?.statistics.viewCount) +
                " views";

              vidDiscBottom.appendChild(youtubeContianer);
              vidDiscBottom.appendChild(vidViews);

              // appending to discription
              discriptionSection.appendChild(vidDisc);
              discriptionSection.appendChild(vidDiscBottom);
              // discriptionSection.appendChild(channelTitle);

              card.appendChild(thumbnailSection);
              card.appendChild(discriptionSection);
              //   });
            }
          });
      });
    });
  console.log("videosWithDetails :", videosWithDetails);
  //chnage page number
  document.getElementsByClassName("pse-pagination-container")[0].innerHTML =
    pageTokenList.length + 1;
}

// next button function
function nextPageHandler() {
  pageTokenList.push(youtubeData[0].nextPageToken);
  fetchYoutubeApi();
  only10Element();
  removalOfClass();
}

// previous button function
function prevPageHandler() {
  pageTokenList.pop();
  fetchYoutubeApi();
  only10Element();
  removalOfClass();
}

function removalOfClass() {
  const getClassNameHide = document.getElementsByClassName("hide");
  const classToArray = Array.from(getClassNameHide);
  if (pageTokenList.length > 0) {
    classToArray.map((el) => {
      el.classList.remove("hide");
    });
  } else {
    const addHideToPrevBtn = document.getElementById("pse-prev-btn");
    const addHideToPagination = document.getElementById("pse-pagination");

    addHideToPrevBtn.classList.add("hide");
    addHideToPagination.classList.add("hide");
  }
}

// function to convert youtube video to human readable content
function convertDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (match[1] || "0H")?.slice(0, -1);
  const minutes = (match[2] || "0M")?.slice(0, -1);
  const seconds = (match[3] || "0S")?.slice(0, -1);

  return `${hours.padStart(2, "0")}:${minutes.padStart(
    2,
    "0"
  )}:${seconds.padStart(2, "0")}`;
}

//views converter
function formatYouTubeViews(views) {
  const viewCount = parseInt(views, 10);

  if (viewCount >= 1000000) {
    const formattedViews = (viewCount / 1000000).toFixed(1);
    return `${formattedViews}M`;
  }

  if (viewCount >= 1000) {
    const formattedViews = Math.round(viewCount / 1000);
    return `${formattedViews}K`;
  }

  return `${viewCount}`;
}

function searchHandler() {
  var userQuery = document.getElementsByClassName("pse-user-query")[0].value;
  query = userQuery;
  document.getElementsByClassName("pse-user-query")[0].value = "";
  fetchYoutubeApi();
  only10Element();
}

function only10Element() {
  // Check if there are more than 5 child div elements
  const bodyContainer = document.getElementById("pse-card-stack-contianer");
  const bodySubContainer = Array.from(
    bodyContainer?.getElementsByClassName("pse-card-container")
  );
  if (bodySubContainer.length >= 10) {
    for (let el = 0; el < 10; el++) {
      bodyContainer.removeChild(bodySubContainer[el]);
    }
  }
}
const pseContainer = document.getElementById("pse-whole-contianer");

function PreviewComponent(videoId) {
  const previewCotnainer = document.createElement("div");
  previewCotnainer.className = "pse-preview-container";

  //top section of preview
  const topsection = document.createElement("div");
  topsection.className = "pse-preview-top-section";

  //iframe
  const iframeTag = document.createElement("iframe");
  iframeTag.setAttribute("allow", "autoplay; encrypted-media");
  iframeTag.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  iframeTag.className = "pse-iframe";

  topsection.appendChild(iframeTag);

  //bottom section of preview
  const bottomSection = document.createElement("div");
  bottomSection.className = "pse-preview-bottom-section";

  //visigt btn
  const visitBtn = document.createElement("div");
  visitBtn.className = "pse-visit-btn";
  visitBtn.innerHTML = "Visit";
  visitBtn.addEventListener("click", () => visitBtnHandler(videoId));

  const closeBtn = document.createElement("div");
  closeBtn.className = "pse-close-btn";
  closeBtn.addEventListener("click", closeBtnHandler);
  closeBtn.innerHTML = "Close";

  bottomSection.appendChild(closeBtn);
  bottomSection.appendChild(visitBtn);

  previewCotnainer.appendChild(topsection);
  previewCotnainer.appendChild(bottomSection);

  pseContainer.appendChild(previewCotnainer);
}

function closeBtnHandler() {
  const toBeRemove = Array.from(
    pseContainer.getElementsByClassName("pse-preview-container")
  );
  pseContainer.removeChild(toBeRemove[0]);
}

function visitBtnHandler(videoId) {
  videosWithDetails.map((data) => {
    if (data.videoId === videoId) {
      window.open(data.officialLink, "_blank");
    }
  });
}

function duration() {}

window.onload = fetchYoutubeApi;
