const socket = io();

document.getElementById("form-messages").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = document.getElementById("input-messages").value;
  // kiểm tra từ tục tiểu
  const acknowledgements = (error) => {
    if (error) {
      // return alert("tin nhắn không hợp lệ")
      return alert(error);
    }
    console.log("acknowledgements");
  };
  socket.emit(
    "send message from client to server",
    messageText,
    acknowledgements
  );
});

socket.on("send message from server to client", (message) => {
  console.log(message);
  // hiển thị tin nhắn lên màn hình
  const { createAt, messagesText, username } = message;
  const htmlContent = document.getElementById("app__messages").innerHTML;
  const messageElement = `
    <div class="message-item" id="message-item">
    <div class="message__row1">
        <p class="message__name">${username}</p>
        <p class="message__date">${createAt}</p>
    </div>
    <div class="message__row2">
        <p class="message__content">
            ${messagesText}
        </p>
    </div>
    `;
  let contentRender = htmlContent + messageElement;
  document.getElementById("app__messages").innerHTML = contentRender;

  // clear input
  document.getElementById("input-messages").value = "";
});

// gửi vị trí
document.getElementById("btn-share-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("trình duyệt đang dùng không hỗ trợ chia sẽ vị trí");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    console.log("position", position);
    const { latitude, longitude } = position.coords;
    socket.emit("share location from client to server", {
      latitude,
      longitude,
    });
  });
});

socket.on("share location from server to client", (data) => {
  //   console.log("linkLocation", linkLocation);

  const { createAt, messagesText, username } = data;

  const htmlContent = document.getElementById("app__messages").innerHTML;
  const messageElement = `
    <div class="message-item" id="message-item">
    <div class="message__row1">
        <p class="message__name">${username}</p>
        <p class="message__date">${createAt}</p>
    </div>
    <div class="message__row2">
        <p class="message__content">
        <a href="${messagesText}" target="_blank">${messagesText}</a>
        </p>
    </div>
    `;
  let contentRender = htmlContent + messageElement;
  document.getElementById("app__messages").innerHTML = contentRender;
});

// xử lý query string
const queryString = location.search;
// console.log("queryString", queryString)
const params = Qs.parse(queryString, {
  ignoreQueryPrefix: true,
});
// console.log("params", params)
const { room, username } = params;

socket.emit("join room from client to server", { room, username });
// hiển thị tên phòng lên màn hình
document.getElementById("app__title").innerHTML = room;

// xử lý user list
socket.on("send user list from server to client", (userList) => {
  // console.log("userList", userList)
  let contentHtml = "";
  userList.map((user, index) => {
    contentHtml += `
            <li class="app__item-user">
                ${user.username}
            </li>
            `;
  });
  document.getElementById("app__list-user--content").innerHTML = contentHtml;
});
